const MockUSDC = artifacts.require("MockUSDC");
const ScholarshipFund = artifacts.require("ScholarshipFund");

module.exports = async function (deployer, network, accounts) {
  const initialSupply = 1000000 * Math.pow(10, 6); // 1,000,000 USDC (6 decimals)
  await deployer.deploy(MockUSDC, initialSupply);
  const mockUSDC = await MockUSDC.deployed();

  await deployer.deploy(ScholarshipFund, mockUSDC.address);
  const scholarshipFund = await ScholarshipFund.deployed();

  // Pre-fund a few accounts for testing
  const testAccounts = accounts.slice(1, 8);
  for (const account of testAccounts) {
    await mockUSDC.transfer(account, 1000 * Math.pow(10, 6)); // 1,000 USDC per account
  }

  console.log(`MockUSDC deployed at: ${mockUSDC.address}`);
  console.log(`ScholarshipFund deployed at: ${scholarshipFund.address}`);
};
