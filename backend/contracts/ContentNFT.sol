// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContentNFT
 * @dev ERC-721 NFT representing ownership of video content on DeadTrendTracker
 */
contract ContentNFT is ERC721, Ownable {
    
    uint256 public tokenCounter;
    
    // Mapping from token ID to IPFS hash
    mapping(uint256 => string) public tokenURIs;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public tokenCreators;
    
    // Events
    event ContentMinted(uint256 indexed tokenId, address indexed creator, string ipfsHash);
    
    constructor() ERC721("DeadTrendContent", "DTC-NFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }
    
    /**
     * @dev Mint a new Content NFT
     * @param creator Address of the content creator
     * @param ipfsHash IPFS hash of the video content
     * @return tokenId The ID of the newly minted token
     */
    function mintContentNFT(
        address creator,
        string memory ipfsHash
    ) public onlyOwner returns (uint256) {
        require(creator != address(0), "Invalid creator address");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        uint256 tokenId = tokenCounter;
        tokenCounter++;
        
        tokenURIs[tokenId] = ipfsHash;
        tokenCreators[tokenId] = creator;
        
        _safeMint(creator, tokenId);
        
        emit ContentMinted(tokenId, creator, ipfsHash);
        return tokenId;
    }
    
    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The token ID to query
     * @return The IPFS hash stored as the token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenURIs[tokenId];
    }
    
    /**
     * @dev Returns the creator address for a given token ID
     * @param tokenId The token ID to query
     * @return The address of the original creator
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenCreators[tokenId];
    }
}
