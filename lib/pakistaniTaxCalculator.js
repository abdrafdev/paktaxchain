/**
 * Pakistani Tax Calculator
 * Calculates various Pakistani taxes based on FBR rules
 */

// Pakistani Tax Rates (Simplified - Based on FBR)
export const TAX_RATES = {
  INCOME_TAX: {
    // Annual Income Tax Slabs (PKR)
    slabs: [
      { min: 0, max: 600000, rate: 0 },           // First 6 lakh - No tax
      { min: 600001, max: 1200000, rate: 2.5 },  // 6-12 lakh - 2.5%
      { min: 1200001, max: 2400000, rate: 12.5 }, // 12-24 lakh - 12.5%
      { min: 2400001, max: 3000000, rate: 20 },   // 24-30 lakh - 20%
      { min: 3000001, max: 4000000, rate: 25 },   // 30-40 lakh - 25%
      { min: 4000001, max: 7000000, rate: 32.5 }, // 40-70 lakh - 32.5%
      { min: 7000001, max: Infinity, rate: 35 }   // Above 70 lakh - 35%
    ]
  },
  
  PROPERTY_TAX: {
    // Property Value Tax (Annual)
    rate: 0.8, // 0.8% of property value
    exemptionLimit: 2500000 // Properties below 25 lakh exempted
  },
  
  VEHICLE_TAX: {
    // Vehicle Registration/Token Tax (Annual)
    categories: {
      MOTORCYCLE: { under125cc: 1000, above125cc: 2000 },
      CAR: { 
        under1000cc: 8000,
        "1000-1300cc": 12000,
        "1300-1600cc": 18000,
        "1600-1800cc": 25000,
        above1800cc: 35000
      },
      COMMERCIAL: { rate: 2.5 } // 2.5% of vehicle value
    }
  },
  
  SALES_TAX_GST: {
    standard: 18, // 18% standard GST
    reduced: 5,   // 5% for essential items
    zero: 0       // 0% for exports/essential medicines
  },
  
  BUSINESS_TAX: {
    // Presumptive Tax for Small Businesses
    retailer: 1.5,    // 1.5% of turnover
    distributor: 0.5, // 0.5% of turnover
    manufacturer: 1   // 1% of turnover
  },
  
  WITHHOLDING_TAX: {
    // Various withholding tax rates
    salary: 1,        // 1% on salary above exemption
    contractor: 8,    // 8% on contracts
    bankInterest: 20, // 20% on bank interest
    dividend: 15      // 15% on dividends
  }
}

// Pakistani Cities with their tax jurisdiction
export const PAKISTANI_CITIES = [
  { name: "Karachi", province: "Sindh", population: 14916000 },
  { name: "Lahore", province: "Punjab", population: 11126000 },
  { name: "Faisalabad", province: "Punjab", population: 3204000 },
  { name: "Rawalpindi", province: "Punjab", population: 2098000 },
  { name: "Gujranwala", province: "Punjab", population: 2027000 },
  { name: "Peshawar", province: "KPK", population: 1970000 },
  { name: "Multan", province: "Punjab", population: 1871000 },
  { name: "Hyderabad", province: "Sindh", population: 1734000 },
  { name: "Islamabad", province: "Federal", population: 1015000 },
  { name: "Quetta", province: "Balochistan", population: 1001000 }
]

/**
 * Calculate Income Tax based on annual income
 * @param {number} annualIncome - Annual income in PKR
 * @returns {object} Tax calculation details
 */
export function calculateIncomeTax(annualIncome) {
  if (!annualIncome || annualIncome <= 0) {
    return { taxable: 0, tax: 0, netIncome: annualIncome, details: [] }
  }

  let totalTax = 0
  let remainingIncome = annualIncome
  const details = []

  for (const slab of TAX_RATES.INCOME_TAX.slabs) {
    if (remainingIncome <= 0) break

    const taxableInThisSlab = Math.min(
      remainingIncome,
      slab.max === Infinity ? remainingIncome : slab.max - slab.min + 1
    )

    const taxInThisSlab = (taxableInThisSlab * slab.rate) / 100

    details.push({
      slab: `${slab.min.toLocaleString()} - ${slab.max === Infinity ? '∞' : slab.max.toLocaleString()}`,
      rate: slab.rate,
      taxableAmount: taxableInThisSlab,
      tax: taxInThisSlab
    })

    totalTax += taxInThisSlab
    remainingIncome -= taxableInThisSlab
  }

  return {
    annualIncome,
    taxable: annualIncome,
    tax: Math.round(totalTax),
    netIncome: annualIncome - Math.round(totalTax),
    effectiveRate: ((totalTax / annualIncome) * 100).toFixed(2),
    details
  }
}

/**
 * Calculate Property Tax
 * @param {number} propertyValue - Property value in PKR
 * @returns {object} Property tax calculation
 */
export function calculatePropertyTax(propertyValue) {
  if (!propertyValue || propertyValue <= TAX_RATES.PROPERTY_TAX.exemptionLimit) {
    return {
      propertyValue,
      taxableValue: 0,
      tax: 0,
      isExempt: true,
      exemptionLimit: TAX_RATES.PROPERTY_TAX.exemptionLimit
    }
  }

  const tax = (propertyValue * TAX_RATES.PROPERTY_TAX.rate) / 100

  return {
    propertyValue,
    taxableValue: propertyValue,
    tax: Math.round(tax),
    rate: TAX_RATES.PROPERTY_TAX.rate,
    isExempt: false
  }
}

/**
 * Calculate Vehicle Token Tax
 * @param {string} vehicleType - Type of vehicle
 * @param {string} category - Category/engine size
 * @returns {number} Annual vehicle tax
 */
export function calculateVehicleTax(vehicleType, category) {
  const rates = TAX_RATES.VEHICLE_TAX.categories[vehicleType.toUpperCase()]
  
  if (!rates) return 0

  if (typeof rates[category] === 'number') {
    return rates[category]
  }

  return 0
}

/**
 * Calculate Sales Tax (GST)
 * @param {number} amount - Sale amount in PKR
 * @param {string} category - Tax category (standard, reduced, zero)
 * @returns {object} GST calculation
 */
export function calculateSalesTax(amount, category = 'standard') {
  const rate = TAX_RATES.SALES_TAX_GST[category] || TAX_RATES.SALES_TAX_GST.standard
  const tax = (amount * rate) / 100

  return {
    amount,
    rate,
    tax: Math.round(tax),
    totalWithTax: amount + Math.round(tax)
  }
}

/**
 * Calculate Business Tax (Presumptive)
 * @param {number} turnover - Annual turnover in PKR
 * @param {string} businessType - Type of business
 * @returns {object} Business tax calculation
 */
export function calculateBusinessTax(turnover, businessType) {
  const rate = TAX_RATES.BUSINESS_TAX[businessType] || TAX_RATES.BUSINESS_TAX.retailer
  const tax = (turnover * rate) / 100

  return {
    turnover,
    businessType,
    rate,
    tax: Math.round(tax)
  }
}

/**
 * Get tax summary for a taxpayer
 * @param {object} taxpayerData - Taxpayer information
 * @returns {object} Complete tax summary
 */
export function getTaxSummary(taxpayerData) {
  const {
    annualIncome = 0,
    propertyValue = 0,
    vehicleType = '',
    vehicleCategory = '',
    businessTurnover = 0,
    businessType = 'retailer'
  } = taxpayerData

  const incomeTax = calculateIncomeTax(annualIncome)
  const propertyTax = calculatePropertyTax(propertyValue)
  const vehicleTax = calculateVehicleTax(vehicleType, vehicleCategory)
  const businessTax = businessTurnover > 0 ? calculateBusinessTax(businessTurnover, businessType) : { tax: 0 }

  const totalTax = incomeTax.tax + propertyTax.tax + vehicleTax + businessTax.tax

  return {
    incomeTax,
    propertyTax,
    vehicleTax,
    businessTax,
    totalTax,
    breakdown: {
      income: incomeTax.tax,
      property: propertyTax.tax,
      vehicle: vehicleTax,
      business: businessTax.tax
    }
  }
}

/**
 * Format PKR amount with commas
 * @param {number} amount - Amount in PKR
 * @returns {string} Formatted amount
 */
export function formatPKR(amount) {
  return `PKR ${amount.toLocaleString()}`
}

/**
 * Validate CNIC format
 * @param {string} cnic - CNIC number
 * @returns {boolean} Is valid CNIC
 */
export function validateCNIC(cnic) {
  // Pakistani CNIC format: 12345-1234567-1
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
  return cnicRegex.test(cnic)
}

/**
 * Hash CNIC for privacy (simple hash for demo)
 * @param {string} cnic - CNIC number
 * @returns {string} Hashed CNIC
 */
export function hashCNIC(cnic) {
  // In production, use proper crypto hashing
  return btoa(cnic).replace(/[+/=]/g, '').substring(0, 16)
}

const pakistaniTaxCalculator = {
  calculateIncomeTax,
  calculatePropertyTax,
  calculateVehicleTax,
  calculateSalesTax,
  calculateBusinessTax,
  getTaxSummary,
  formatPKR,
  validateCNIC,
  hashCNIC,
  TAX_RATES,
  PAKISTANI_CITIES
}

export default pakistaniTaxCalculator
