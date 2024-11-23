const ScholarshipFund = artifacts.require("ScholarshipFund");

contract("ScholarshipFund", (accounts) => {
  let scholarshipFund;
  const owner = accounts[0];
  const fundOwner = accounts[1];
  const applicant1 = accounts[2];
  const applicant2 = accounts[3];
  const reviewer1 = accounts[4];
  const reviewer2 = accounts[5];
  const donor = accounts[6];

  before(async () => {
    scholarshipFund = await ScholarshipFund.deployed();
  });

  it("should allow a fund owner to create a fund", async () => {
    const fundName = "Education Fund";
    const minApprovals = 2;
    const reviewers = [reviewer1, reviewer2];
    const fundAmount = web3.utils.toWei("5", "ether");

    // Fund owner creates a fund
    await scholarshipFund.createFund(fundName, minApprovals, reviewers, {
      from: fundOwner,
      value: fundAmount,
    });

    // Retrieve the fund details
    const fund = await scholarshipFund.getFund(1);
    assert.equal(fund.name, fundName, "Fund name mismatch");
    assert.equal(fund.fundOwner, fundOwner, "Fund owner mismatch");
    assert.equal(fund.minApprovals.toString(), minApprovals.toString(), "Min approvals mismatch");
    assert.equal(fund.balance.toString(), fundAmount, "Fund balance mismatch");
  });

  it("should allow an applicant to submit an application", async () => {
    const requestedAmount = web3.utils.toWei("1", "ether");
    const mongoDbHash = "QmTestHash";

    // Applicant submits an application to the first fund
    await scholarshipFund.submitApplication(requestedAmount, mongoDbHash, 1, {
      from: applicant1,
    });

    // Retrieve the application details
    const app = await scholarshipFund.getApplication(1);
    
    assert.equal(app.applicant, applicant1, "Applicant mismatch");
    assert.equal(app.requestedAmount.toString(), requestedAmount, "Requested amount mismatch");
    assert.equal(app.mongoDbHash, mongoDbHash, "MongoDB hash mismatch");
    assert.equal(app.fundId.toString(), "1", "Fund ID mismatch");
    assert.equal(app.status, "Pending", "Application status mismatch");
  });

  it("should allow a reviewer to approve an application", async () => {
    // Reviewer 1 approves the application
    await scholarshipFund.reviewApplication(1, true, { from: reviewer1 });

    // Retrieve the application details
    const app = await scholarshipFund.getApplication(1);
    assert.equal(app.approvers.length, 1, "Approvers length mismatch");
    assert.equal(app.approvers[0], reviewer1, "Reviewer mismatch");
    assert.equal(app.status, "Pending", "Application status should still be pending");
  });

  it("should allow another reviewer to approve the application and auto-approve it", async () => {
    // Reviewer 2 approves the application
    await scholarshipFund.reviewApplication(1, true, { from: reviewer2 });

    // Retrieve the application details
    const app = await scholarshipFund.getApplication(1);
    assert.equal(app.approvers.length, 2, "Approvers length mismatch");
    assert.equal(app.approvers[1], reviewer2, "Second reviewer mismatch");
    assert.equal(app.status, "Approved", "Application should be auto-approved");
  });

  it("should allow a donor to donate to a fund", async () => {
    const donationAmount = web3.utils.toWei("2", "ether");

    // Donor donates to the first fund
    await scholarshipFund.donateToFund(1, {
      from: donor,
      value: donationAmount,
    });

    // Retrieve the fund details
    const fund = await scholarshipFund.getFund(1);
    assert.equal(
      fund.balance.toString(),
      web3.utils.toWei("7", "ether"),
      "Fund balance mismatch after donation"
    );
  });

  it("should allow the contract owner to approve the fund", async () => {
    // Contract owner approves the fund
    await scholarshipFund.approveFund(1, { from: owner });

    // Retrieve the fund details
    const fund = await scholarshipFund.getFund(1);
    assert.equal(fund.approved, true, "Fund approval mismatch");
  });

  it("should allow the contract owner to disburse funds", async () => {
    const applicantBalanceBefore = await web3.eth.getBalance(applicant1);

    // Contract owner disburses funds for the first application
    await scholarshipFund.disburseFunds(1, { from: owner });

    // Retrieve the application details
    const app = await scholarshipFund.getApplication(1);
    assert.equal(app.status, "Funded", "Application status mismatch after disbursement");

    // Check the applicant's balance after disbursement
    const applicantBalanceAfter = await web3.eth.getBalance(applicant1);
    assert(
      web3.utils
        .toBN(applicantBalanceAfter)
        .sub(web3.utils.toBN(applicantBalanceBefore))
        .toString() === web3.utils.toWei("1", "ether"),
      "Applicant balance mismatch after disbursement"
    );
  });
});
