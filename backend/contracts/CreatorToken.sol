// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorToken
 * @dev ERC-20 token for rewarding content creators on DeadTrendTracker platform
 */
contract CreatorToken is ERC20, Ownable {
    
    constructor() ERC20("DeadTrendCreator", "DTC") Ownable(msg.sender) {
        // Initial supply can be minted to owner if needed
    }
    
    /**
     * @dev Mint new tokens to a specified address
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (in wei, 18 decimals)
     * Only the owner (RewardPool contract) can mint tokens
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be positive");
        _mint(to, amount);
    }
    
    /**
     * @dev Returns the number of decimals used for token amounts
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
