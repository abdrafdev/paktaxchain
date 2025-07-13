// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PakTaxLog - Pakistan Tax Recording System
 * @dev Records tax payments made in PKR via JazzCash/EasyPaisa/Banks
 * @notice Blockchain is used for transparency and immutable record-keeping
 */
contract PakTaxLog is Ownable, Pausable {
    
    // Tax Types (Pakistani Tax System)
    enum TaxType {
        INCOME_TAX,
        PROPERTY_TAX,
        VEHICLE_TAX,
        BUSINESS_TAX,
        SALES_TAX_GST,
        IMPORT_EXPORT,
        WITHHOLDING_TAX
    }

    // Payment Methods (Pakistani Payment Systems)
    enum PaymentMethod {
        JAZZCASH,
        EASYPAISA,
        BANK_TRANSFER,
        ONE_LINK,
        CREDIT_DEBIT_CARD
    }

    // Tax Payment Record
    struct TaxRecord {
        string hashedCNIC;           // Privacy-protected CNIC
        string city;                 // Pakistani city
        uint256 amountPKR;          // Amount in Pakistani Rupees (in paisa for precision)
        TaxType taxType;            // Type of tax paid
        PaymentMethod paymentMethod; // How it was paid
        string paymentReference;     // JazzCash/EasyPaisa/Bank reference
        uint256 timestamp;          // When paid
        bool verified;              // Government verification status
        uint256 recordId;           // Unique record ID
    }

    // City Statistics
    struct CityData {
        uint256 totalTaxCollectedPKR;
        uint256 totalFundsAllocatedPKR;
        uint256 totalFundsUsedPKR;
        uint256 taxpayerCount;
        uint256 lastUpdated;
        bool isRegistered;
    }

    // Taxpayer Profile
    struct TaxpayerData {
        string hashedCNIC;
        string city;
        string phoneNumber;          // For OTP verification
        uint256 totalTaxPaidPKR;
        uint256 paymentCount;
        uint256 honestyScore;        // Based on timely payments
        bool isVerified;             // KYC status
        uint256 registrationDate;
    }

    // State Variables
    mapping(uint256 => TaxRecord) public taxRecords;
    mapping(string => CityData) public cityStats;
    mapping(string => TaxpayerData) public taxpayers; // hashedCNIC => TaxpayerData
    mapping(string => uint256[]) public cityTaxRecords; // city => recordIds[]
    mapping(string => uint256[]) public taxpayerRecords; // hashedCNIC => recordIds[]
    
    string[] public registeredCities;
    uint256 public totalTaxCollectedPKR;
    uint256 public totalFundsAllocatedPKR;
    uint256 public nextRecordId = 1;
    uint256 public constant PKR_TO_PAISA = 100; // 1 PKR = 100 paisa

    // Events
    event TaxPaid(
        string indexed hashedCNIC,
        string indexed city,
        uint256 amountPKR,
        TaxType taxType,
        PaymentMethod paymentMethod,
        string paymentReference,
        uint256 recordId
    );
    
    event FundsAllocated(
        string indexed city,
        uint256 amountPKR,
        uint256 percentage,
        uint256 timestamp
    );
    
    event TaxpayerRegistered(
        string indexed hashedCNIC,
        string city,
        uint256 timestamp
    );
    
    event CityRegistered(
        string indexed city,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {
        // Register major Pakistani cities
        _registerCity("Karachi");
        _registerCity("Lahore");
        _registerCity("Islamabad");
        _registerCity("Rawalpindi");
        _registerCity("Faisalabad");
        _registerCity("Multan");
        _registerCity("Peshawar");
        _registerCity("Quetta");
        _registerCity("Sialkot");
        _registerCity("Gujranwala");
        _registerCity("Hyderabad");
        _registerCity("Sukkur");
    }

    /**
     * @dev Register a new taxpayer
     * @param hashedCNIC Privacy-protected CNIC hash
     * @param city Taxpayer's city
     * @param phoneNumber Phone for OTP verification
     */
    function registerTaxpayer(
        string memory hashedCNIC,
        string memory city,
        string memory phoneNumber
    ) external onlyOwner whenNotPaused {
        require(cityStats[city].isRegistered, "City not registered");
        require(taxpayers[hashedCNIC].registrationDate == 0, "Taxpayer already registered");
        
        taxpayers[hashedCNIC] = TaxpayerData({
            hashedCNIC: hashedCNIC,
            city: city,
            phoneNumber: phoneNumber,
            totalTaxPaidPKR: 0,
            paymentCount: 0,
            honestyScore: 100, // Start with perfect score
            isVerified: true,
            registrationDate: block.timestamp
        });
        
        cityStats[city].taxpayerCount++;
        
        emit TaxpayerRegistered(hashedCNIC, city, block.timestamp);
    }

    /**
     * @dev Log a tax payment (called by backend after PKR payment confirmation)
     * @param hashedCNIC Privacy-protected CNIC
     * @param amountPKR Amount in PKR (will be converted to paisa)
     * @param taxType Type of tax paid
     * @param paymentMethod How the payment was made
     * @param paymentReference Payment gateway reference
     */
    function logTaxPayment(
        string memory hashedCNIC,
        uint256 amountPKR,
        TaxType taxType,
        PaymentMethod paymentMethod,
        string memory paymentReference
    ) external onlyOwner whenNotPaused {
        require(taxpayers[hashedCNIC].registrationDate > 0, "Taxpayer not registered");
        require(amountPKR > 0, "Amount must be greater than 0");
        
        string memory city = taxpayers[hashedCNIC].city;
        uint256 amountInPaisa = amountPKR * PKR_TO_PAISA;
        
        // Create tax record
        TaxRecord memory record = TaxRecord({
            hashedCNIC: hashedCNIC,
            city: city,
            amountPKR: amountInPaisa,
            taxType: taxType,
            paymentMethod: paymentMethod,
            paymentReference: paymentReference,
            timestamp: block.timestamp,
            verified: true,
            recordId: nextRecordId
        });
        
        // Store the record
        taxRecords[nextRecordId] = record;
        cityTaxRecords[city].push(nextRecordId);
        taxpayerRecords[hashedCNIC].push(nextRecordId);
        
        // Update taxpayer stats
        taxpayers[hashedCNIC].totalTaxPaidPKR += amountInPaisa;
        taxpayers[hashedCNIC].paymentCount++;
        
        // Update city stats
        cityStats[city].totalTaxCollectedPKR += amountInPaisa;
        cityStats[city].lastUpdated = block.timestamp;
        
        // Update global stats
        totalTaxCollectedPKR += amountInPaisa;
        
        emit TaxPaid(
            hashedCNIC,
            city,
            amountPKR,
            taxType,
            paymentMethod,
            paymentReference,
            nextRecordId
        );
        
        nextRecordId++;
    }

    /**
     * @dev Allocate development funds to cities based on tax contribution
     */
    function allocateFunds() external onlyOwner {
        require(totalTaxCollectedPKR > totalFundsAllocatedPKR, "No new funds to allocate");
        
        uint256 fundsToAllocate = totalTaxCollectedPKR - totalFundsAllocatedPKR;
        
        for (uint256 i = 0; i < registeredCities.length; i++) {
            string memory city = registeredCities[i];
            uint256 cityCollection = cityStats[city].totalTaxCollectedPKR;
            
            if (cityCollection > 0 && totalTaxCollectedPKR > 0) {
                uint256 cityPercentage = (cityCollection * 100) / totalTaxCollectedPKR;
                uint256 cityAllocation = (fundsToAllocate * cityCollection) / totalTaxCollectedPKR;
                
                cityStats[city].totalFundsAllocatedPKR += cityAllocation;
                
                emit FundsAllocated(city, cityAllocation, cityPercentage, block.timestamp);
            }
        }
        
        totalFundsAllocatedPKR = totalTaxCollectedPKR;
    }

    // View Functions
    function getCityStats(string memory city) external view returns (CityData memory) {
        return cityStats[city];
    }
    
    function getTaxpayerData(string memory hashedCNIC) external view returns (TaxpayerData memory) {
        return taxpayers[hashedCNIC];
    }
    
    function getTaxRecord(uint256 recordId) external view returns (TaxRecord memory) {
        return taxRecords[recordId];
    }
    
    function getCityTaxRecords(string memory city) external view returns (uint256[] memory) {
        return cityTaxRecords[city];
    }
    
    function getTaxpayerRecords(string memory hashedCNIC) external view returns (uint256[] memory) {
        return taxpayerRecords[hashedCNIC];
    }
    
    function getRegisteredCities() external view returns (string[] memory) {
        return registeredCities;
    }
    
    function getCityContributionPercentage(string memory city) external view returns (uint256) {
        if (totalTaxCollectedPKR == 0) return 0;
        return (cityStats[city].totalTaxCollectedPKR * 100) / totalTaxCollectedPKR;
    }
    
    function getTotalStats() external view returns (
        uint256 totalCollected,
        uint256 totalAllocated,
        uint256 totalCities,
        uint256 totalRecords
    ) {
        return (
            totalTaxCollectedPKR,
            totalFundsAllocatedPKR,
            registeredCities.length,
            nextRecordId - 1
        );
    }

    // Admin Functions
    function registerCity(string memory city) external onlyOwner {
        _registerCity(city);
    }
    
    function _registerCity(string memory city) internal {
        require(!cityStats[city].isRegistered, "City already registered");
        
        cityStats[city] = CityData({
            totalTaxCollectedPKR: 0,
            totalFundsAllocatedPKR: 0,
            totalFundsUsedPKR: 0,
            taxpayerCount: 0,
            lastUpdated: block.timestamp,
            isRegistered: true
        });
        
        registeredCities.push(city);
        
        emit CityRegistered(city, block.timestamp);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Utility Functions
    function pkrToPaisa(uint256 pkrAmount) public pure returns (uint256) {
        return pkrAmount * PKR_TO_PAISA;
    }
    
    function paisaToPkr(uint256 paisaAmount) public pure returns (uint256) {
        return paisaAmount / PKR_TO_PAISA;
    }
}
