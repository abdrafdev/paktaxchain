// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PakTaxChain - Pakistan's Transparent Tax System
 * @dev Records tax payments made in PKR via traditional payment methods
 * @notice Blockchain is used for transparency, not for payments
 */
contract PakTaxChain is Ownable, ReentrancyGuard, Pausable {
    // Structs
    struct TaxPayment {
        address taxpayer;
        uint256 amount;
        string city;
        string cnic; // Hashed CNIC for privacy
        uint256 timestamp;
        uint256 paymentId;
    }
    
    struct CityStats {
        uint256 totalTaxCollected;
        uint256 totalFundsAllocated;
        uint256 totalFundsWithdrawn;
        uint256 taxpayerCount;
        bool isRegistered;
    }
    
    struct TaxpayerProfile {
        string cnic;
        string city;
        uint256 totalTaxPaid;
        uint256 paymentCount;
        uint256 reputationScore;
        bool hasNFT;
    }
    
    // State variables
    mapping(address => TaxpayerProfile) public taxpayers;
    mapping(string => CityStats) public cityStats;
    mapping(uint256 => TaxPayment) public taxPayments;
    mapping(address => uint256[]) public taxpayerPayments;
    mapping(string => address[]) public cityTaxpayers;
    
    string[] public registeredCities;
    uint256 public totalTaxCollected;
    uint256 public totalFundsAllocated;
    uint256 public nextPaymentId = 1;
    
    // Events
    event TaxPaymentMade(
        address indexed taxpayer,
        uint256 indexed paymentId,
        uint256 amount,
        string city,
        uint256 timestamp
    );
    
    event FundsAllocated(
        string indexed city,
        uint256 amount,
        uint256 timestamp
    );
    
    event FundsWithdrawn(
        string indexed city,
        uint256 amount,
        address recipient,
        uint256 timestamp
    );
    
    event CityRegistered(string indexed city, uint256 timestamp);
    event NFTAwarded(address indexed taxpayer, uint256 timestamp);
    
    // Modifiers
    modifier onlyRegisteredCity(string memory city) {
        require(cityStats[city].isRegistered, "City not registered");
        _;
    }
    
    modifier onlyAuthorizedWithdrawer(string memory city) {
        // In production, this would be linked to government officials
        require(
            msg.sender == owner() || 
            isAuthorizedForCity(msg.sender, city),
            "Not authorized to withdraw funds for this city"
        );
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // Pre-register major Pakistani cities
        registerCity("Karachi");
        registerCity("Lahore");
        registerCity("Islamabad");
        registerCity("Rawalpindi");
        registerCity("Faisalabad");
        registerCity("Multan");
        registerCity("Peshawar");
        registerCity("Quetta");
        registerCity("Sialkot");
        registerCity("Gujranwala");
    }
    
    // Core Functions
    function payTax(
        string memory city,
        string memory hashedCNIC
    ) external payable whenNotPaused onlyRegisteredCity(city) {
        require(msg.value > 0, "Tax amount must be greater than 0");
        require(bytes(hashedCNIC).length > 0, "CNIC required");
        
        // Create payment record
        TaxPayment memory payment = TaxPayment({
            taxpayer: msg.sender,
            amount: msg.value,
            city: city,
            cnic: hashedCNIC,
            timestamp: block.timestamp,
            paymentId: nextPaymentId
        });
        
        // Store payment
        taxPayments[nextPaymentId] = payment;
        taxpayerPayments[msg.sender].push(nextPaymentId);
        
        // Update taxpayer profile
        if (taxpayers[msg.sender].paymentCount == 0) {
            taxpayers[msg.sender] = TaxpayerProfile({
                cnic: hashedCNIC,
                city: city,
                totalTaxPaid: msg.value,
                paymentCount: 1,
                reputationScore: 1,
                hasNFT: false
            });
            cityTaxpayers[city].push(msg.sender);
            cityStats[city].taxpayerCount++;
        } else {
            taxpayers[msg.sender].totalTaxPaid += msg.value;
            taxpayers[msg.sender].paymentCount++;
            taxpayers[msg.sender].reputationScore++;
        }
        
        // Update city stats
        cityStats[city].totalTaxCollected += msg.value;
        totalTaxCollected += msg.value;
        
        // Award NFT for consistent taxpayers
        if (taxpayers[msg.sender].paymentCount >= 5 && !taxpayers[msg.sender].hasNFT) {
            awardNFT(msg.sender);
        }
        
        emit TaxPaymentMade(msg.sender, nextPaymentId, msg.value, city, block.timestamp);
        nextPaymentId++;
    }
    
    function allocateFunds() external onlyOwner {
        require(totalTaxCollected > totalFundsAllocated, "No new funds to allocate");
        
        uint256 fundsToAllocate = totalTaxCollected - totalFundsAllocated;
        
        for (uint256 i = 0; i < registeredCities.length; i++) {
            string memory city = registeredCities[i];
            uint256 cityTaxCollection = cityStats[city].totalTaxCollected;
            
            if (cityTaxCollection > 0) {
                uint256 cityAllocation = (fundsToAllocate * cityTaxCollection) / totalTaxCollected;
                cityStats[city].totalFundsAllocated += cityAllocation;
                
                emit FundsAllocated(city, cityAllocation, block.timestamp);
            }
        }
        
        totalFundsAllocated = totalTaxCollected;
    }
    
    function withdrawFunds(
        string memory city,
        uint256 amount,
        address recipient
    ) external onlyAuthorizedWithdrawer(city) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        
        uint256 availableFunds = cityStats[city].totalFundsAllocated - cityStats[city].totalFundsWithdrawn;
        require(amount <= availableFunds, "Insufficient funds available");
        
        cityStats[city].totalFundsWithdrawn += amount;
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(city, amount, recipient, block.timestamp);
    }
    
    // View Functions
    function getCityStats(string memory city) external view returns (CityStats memory) {
        return cityStats[city];
    }
    
    function getTaxpayerProfile(address taxpayer) external view returns (TaxpayerProfile memory) {
        return taxpayers[taxpayer];
    }
    
    function getTaxPayment(uint256 paymentId) external view returns (TaxPayment memory) {
        return taxPayments[paymentId];
    }
    
    function getTaxpayerPayments(address taxpayer) external view returns (uint256[] memory) {
        return taxpayerPayments[taxpayer];
    }
    
    function getCityTaxpayers(string memory city) external view returns (address[] memory) {
        return cityTaxpayers[city];
    }
    
    function getRegisteredCities() external view returns (string[] memory) {
        return registeredCities;
    }
    
    function getCityTaxPercentage(string memory city) external view returns (uint256) {
        if (totalTaxCollected == 0) return 0;
        return (cityStats[city].totalTaxCollected * 100) / totalTaxCollected;
    }
    
    function getAvailableFunds(string memory city) external view returns (uint256) {
        return cityStats[city].totalFundsAllocated - cityStats[city].totalFundsWithdrawn;
    }
    
    // Admin Functions
    function registerCity(string memory city) public onlyOwner {
        require(!cityStats[city].isRegistered, "City already registered");
        
        cityStats[city].isRegistered = true;
        registeredCities.push(city);
        
        emit CityRegistered(city, block.timestamp);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Internal Functions
    function awardNFT(address taxpayer) internal {
        taxpayers[taxpayer].hasNFT = true;
        emit NFTAwarded(taxpayer, block.timestamp);
    }
    
    function isAuthorizedForCity(address /*user*/, string memory /*city*/) internal pure returns (bool) {
        // This would be implemented based on your authorization logic
        // For now, return false (only owner can withdraw)
        return false;
    }
    
    // Emergency Functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    receive() external payable {
        // Allow contract to receive ETH
    }
}
