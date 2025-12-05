import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CreatorToken } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('CreatorToken', function () {
  let creatorToken: CreatorToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CreatorTokenFactory = await ethers.getContractFactory('CreatorToken');
    creatorToken = await CreatorTokenFactory.deploy();
    await creatorToken.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set the correct name and symbol', async function () {
      expect(await creatorToken.name()).to.equal('DeadTrendCreator');
      expect(await creatorToken.symbol()).to.equal('DTC');
    });

    it('Should set the correct decimals', async function () {
      expect(await creatorToken.decimals()).to.equal(18);
    });

    it('Should set the deployer as owner', async function () {
      expect(await creatorToken.owner()).to.equal(owner.address);
    });
  });

  describe('Minting', function () {
    it('Should allow owner to mint tokens', async function () {
      const amount = ethers.parseEther('100');
      await creatorToken.mint(addr1.address, amount);
      expect(await creatorToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it('Should not allow non-owner to mint tokens', async function () {
      const amount = ethers.parseEther('100');
      await expect(
        creatorToken.connect(addr1).mint(addr2.address, amount)
      ).to.be.revertedWithCustomError(creatorToken, 'OwnableUnauthorizedAccount');
    });

    it('Should not allow minting to zero address', async function () {
      const amount = ethers.parseEther('100');
      await expect(
        creatorToken.mint(ethers.ZeroAddress, amount)
      ).to.be.revertedWith('Cannot mint to zero address');
    });

    it('Should not allow minting zero amount', async function () {
      await expect(
        creatorToken.mint(addr1.address, 0)
      ).to.be.revertedWith('Amount must be positive');
    });
  });

  describe('Transfers', function () {
    beforeEach(async function () {
      const amount = ethers.parseEther('1000');
      await creatorToken.mint(addr1.address, amount);
    });

    it('Should transfer tokens between accounts', async function () {
      const amount = ethers.parseEther('50');
      await creatorToken.connect(addr1).transfer(addr2.address, amount);
      expect(await creatorToken.balanceOf(addr2.address)).to.equal(amount);
      expect(await creatorToken.balanceOf(addr1.address)).to.equal(ethers.parseEther('950'));
    });

    it('Should fail if sender does not have enough tokens', async function () {
      const amount = ethers.parseEther('2000');
      await expect(
        creatorToken.connect(addr1).transfer(addr2.address, amount)
      ).to.be.revertedWithCustomError(creatorToken, 'ERC20InsufficientBalance');
    });
  });
});
