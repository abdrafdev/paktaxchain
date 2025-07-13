// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaxpayerNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter = 1;
    
    // Mapping from taxpayer address to their NFT level
    mapping(address => uint256) public taxpayerLevel;
    
    // Mapping from taxpayer address to their token ID
    mapping(address => uint256) public taxpayerTokenId;
    
    // Events
    event NFTMinted(address indexed taxpayer, uint256 indexed tokenId, uint256 level);
    event NFTUpgraded(address indexed taxpayer, uint256 indexed tokenId, uint256 newLevel);
    
    constructor() ERC721("PakTaxChain Taxpayer NFT", "PTNFT") Ownable(msg.sender) {
        // Token counter starts at 1
    }
    
    // Mint NFT for taxpayer
    function mintTaxpayerNFT(address taxpayer, uint256 level) external onlyOwner {
        require(taxpayerTokenId[taxpayer] == 0, "Taxpayer already has NFT");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(taxpayer, tokenId);
        taxpayerLevel[taxpayer] = level;
        taxpayerTokenId[taxpayer] = tokenId;
        
        // Set metadata based on level
        string memory uri = generateTokenURI(level);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(taxpayer, tokenId, level);
    }
    
    // Upgrade NFT level
    function upgradeTaxpayerNFT(address taxpayer, uint256 newLevel) external onlyOwner {
        require(taxpayerTokenId[taxpayer] != 0, "Taxpayer doesn't have NFT");
        require(newLevel > taxpayerLevel[taxpayer], "New level must be higher");
        
        uint256 tokenId = taxpayerTokenId[taxpayer];
        taxpayerLevel[taxpayer] = newLevel;
        
        // Update metadata
        string memory uri = generateTokenURI(newLevel);
        _setTokenURI(tokenId, uri);
        
        emit NFTUpgraded(taxpayer, tokenId, newLevel);
    }
    
    // Generate token URI based on level
    function generateTokenURI(uint256 level) internal pure returns (string memory) {
        if (level == 1) {
            return "https://paktaxchain.com/nft/bronze.json";
        } else if (level == 2) {
            return "https://paktaxchain.com/nft/silver.json";
        } else if (level == 3) {
            return "https://paktaxchain.com/nft/gold.json";
        } else if (level == 4) {
            return "https://paktaxchain.com/nft/platinum.json";
        } else {
            return "https://paktaxchain.com/nft/diamond.json";
        }
    }
    
    // Get taxpayer's NFT level
    function getTaxpayerLevel(address taxpayer) external view returns (uint256) {
        return taxpayerLevel[taxpayer];
    }
    
    // Check if taxpayer has NFT
    function hasTaxpayerNFT(address taxpayer) external view returns (bool) {
        return taxpayerTokenId[taxpayer] != 0;
    }
    
    // Override required by Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
