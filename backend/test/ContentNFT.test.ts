import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ContentNFT } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('ContentNFT', function () {
  let contentNFT: ContentNFT;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, creator, addr1] = await ethers.getSigners();

    const ContentNFTFactory = await ethers.getContractFactory('ContentNFT');
    contentNFT = await ContentNFTFactory.deploy();
    await contentNFT.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set the correct name and symbol', async function () {
      expect(await contentNFT.name()).to.equal('DeadTrendContent');
      expect(await contentNFT.symbol()).to.equal('DTC-NFT');
    });

    it('Should initialize token counter to 0', async function () {
      expect(await contentNFT.tokenCounter()).to.equal(0);
    });
  });

  describe('Minting', function () {
    const ipfsHash = 'QmTest123456789';

    it('Should mint NFT to creator', async function () {
      const tx = await contentNFT.mintContentNFT(creator.address, ipfsHash);
      await tx.wait();

      expect(await contentNFT.ownerOf(0)).to.equal(creator.address);
      expect(await contentNFT.tokenCounter()).to.equal(1);
    });

    it('Should store IPFS hash correctly', async function () {
      await contentNFT.mintContentNFT(creator.address, ipfsHash);
      expect(await contentNFT.tokenURI(0)).to.equal(ipfsHash);
    });

    it('Should store creator address correctly', async function () {
      await contentNFT.mintContentNFT(creator.address, ipfsHash);
      expect(await contentNFT.getCreator(0)).to.equal(creator.address);
    });

    it('Should emit ContentMinted event', async function () {
      await expect(contentNFT.mintContentNFT(creator.address, ipfsHash))
        .to.emit(contentNFT, 'ContentMinted')
        .withArgs(0, creator.address, ipfsHash);
    });

    it('Should not allow minting to zero address', async function () {
      await expect(
        contentNFT.mintContentNFT(ethers.ZeroAddress, ipfsHash)
      ).to.be.revertedWith('Invalid creator address');
    });

    it('Should not allow minting with empty IPFS hash', async function () {
      await expect(
        contentNFT.mintContentNFT(creator.address, '')
      ).to.be.revertedWith('IPFS hash required');
    });

    it('Should not allow non-owner to mint', async function () {
      await expect(
        contentNFT.connect(creator).mintContentNFT(creator.address, ipfsHash)
      ).to.be.revertedWithCustomError(contentNFT, 'OwnableUnauthorizedAccount');
    });

    it('Should increment token counter for each mint', async function () {
      await contentNFT.mintContentNFT(creator.address, 'QmHash1');
      await contentNFT.mintContentNFT(creator.address, 'QmHash2');
      await contentNFT.mintContentNFT(creator.address, 'QmHash3');
      expect(await contentNFT.tokenCounter()).to.equal(3);
    });
  });

  describe('Token URI', function () {
    it('Should revert for non-existent token', async function () {
      await expect(contentNFT.tokenURI(999)).to.be.revertedWithCustomError(
        contentNFT,
        'ERC721NonexistentToken'
      );
    });
  });

  describe('Transfers', function () {
    const ipfsHash = 'QmTest123456789';

    beforeEach(async function () {
      await contentNFT.mintContentNFT(creator.address, ipfsHash);
    });

    it('Should allow owner to transfer NFT', async function () {
      await contentNFT.connect(creator).transferFrom(creator.address, addr1.address, 0);
      expect(await contentNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it('Should preserve creator address after transfer', async function () {
      await contentNFT.connect(creator).transferFrom(creator.address, addr1.address, 0);
      expect(await contentNFT.getCreator(0)).to.equal(creator.address);
    });
  });
});
