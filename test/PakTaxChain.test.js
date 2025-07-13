const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PakTaxChain", function () {
  let PakTaxChain, pakTaxChain;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    PakTaxChain = await ethers.getContractFactory("PakTaxChain");
    pakTaxChain = await PakTaxChain.deploy();
    await pakTaxChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pakTaxChain.owner()).to.equal(owner.address);
    });

    it("Should pre-register major cities", async function () {
      const cities = await pakTaxChain.getRegisteredCities();
      expect(cities).to.include("Karachi");
      expect(cities).to.include("Lahore");
      expect(cities).to.include("Islamabad");
    });
  });

  describe("Tax Payment", function () {
    it("Should allow tax payment", async function () {
      const taxAmount = ethers.parseEther("0.1");
      
      await expect(
        pakTaxChain.connect(addr1).payTax("Karachi", "hashed_cnic_123", { value: taxAmount })
      ).to.emit(pakTaxChain, "TaxPaymentMade");
      
      const cityStats = await pakTaxChain.getCityStats("Karachi");
      expect(cityStats.totalTaxCollected).to.equal(taxAmount);
    });

    it("Should track taxpayer profile", async function () {
      const taxAmount = ethers.parseEther("0.1");
      
      await pakTaxChain.connect(addr1).payTax("Karachi", "hashed_cnic_123", { value: taxAmount });
      
      const profile = await pakTaxChain.getTaxpayerProfile(addr1.address);
      expect(profile.totalTaxPaid).to.equal(taxAmount);
      expect(profile.paymentCount).to.equal(1);
      expect(profile.city).to.equal("Karachi");
    });
  });

  describe("Fund Allocation", function () {
    it("Should allocate funds proportionally", async function () {
      const taxAmount1 = ethers.parseEther("0.1");
      const taxAmount2 = ethers.parseEther("0.2");
      
      await pakTaxChain.connect(addr1).payTax("Karachi", "hashed_cnic_123", { value: taxAmount1 });
      await pakTaxChain.connect(addr2).payTax("Lahore", "hashed_cnic_456", { value: taxAmount2 });
      
      await pakTaxChain.allocateFunds();
      
      const karachiStats = await pakTaxChain.getCityStats("Karachi");
      const lahoreStats = await pakTaxChain.getCityStats("Lahore");
      
      expect(karachiStats.totalFundsAllocated).to.equal(taxAmount1);
      expect(lahoreStats.totalFundsAllocated).to.equal(taxAmount2);
    });
  });

  describe("City Management", function () {
    it("Should register new cities", async function () {
      await pakTaxChain.registerCity("Hyderabad");
      
      const cities = await pakTaxChain.getRegisteredCities();
      expect(cities).to.include("Hyderabad");
    });

    it("Should not allow duplicate city registration", async function () {
      await expect(
        pakTaxChain.registerCity("Karachi")
      ).to.be.revertedWith("City already registered");
    });
  });
});
