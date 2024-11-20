// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ScholarshipFund {
    address public owner;
    IERC20 public stablecoin;

    struct Fund {
        uint256 id;
        address owner;
        string name;
        uint256 minRequestAmount;
        uint256 maxRequestAmount;
        string criteriaHash; // MongoDB or IPFS hash for detailed criteria
        uint256 minApprovals;
        uint256 balance; // Balance in stablecoins
    }

    struct Application {
        uint256 id;
        uint256 fundID;
        address applicant;
        uint256 requestedAmount;
        uint256 approvalCount;
        string mongoDbHash; // Metadata for the application
        bool funded;
    }

    uint256 public nextFundID;
    uint256 public nextApplicationID;

    mapping(uint256 => Fund) public funds;
    mapping(uint256 => Application) public applications;
    mapping(uint256 => mapping(address => bool)) public applicationApprovals; // Tracks approvals for each application

    event StablecoinUpdated(address oldAddress, address newAddress);
    event FundCreated(uint256 fundID, string name, address owner);
    event DonationReceived(uint256 fundID, address donor, uint256 amount);
    event ApplicationSubmitted(uint256 appID, uint256 fundID, address applicant);
    event ApplicationApproved(uint256 appID, uint256 approvalCount);
    event FundsDisbursed(uint256 appID, address applicant, uint256 amount);

    modifier onlyFundOwner(uint256 fundID) {
        require(funds[fundID].owner == msg.sender, "Not the fund owner");
        _;
    }

    modifier onlyFundExists(uint256 fundID) {
        require(funds[fundID].id == fundID, "Fund does not exist");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address initialStablecoinAddress) {
        owner = msg.sender;
        stablecoin = IERC20(initialStablecoinAddress); // Set the initial stablecoin address
    }

    // Function to update the stablecoin address
    function setStablecoin(address newStablecoinAddress) external onlyOwner {
        require(newStablecoinAddress != address(0), "Invalid address");
        emit StablecoinUpdated(address(stablecoin), newStablecoinAddress);
        stablecoin = IERC20(newStablecoinAddress);
    }

    // Create a new fund
    function createFund(
        string memory name,
        uint256 minRequestAmount,
        uint256 maxRequestAmount,
        string memory criteriaHash,
        uint256 minApprovals
    ) external returns (uint256) {
        require(minApprovals > 0, "Min approvals must be greater than zero");
        funds[nextFundID] = Fund({
            id: nextFundID,
            owner: msg.sender,
            name: name,
            minRequestAmount: minRequestAmount,
            maxRequestAmount: maxRequestAmount,
            criteriaHash: criteriaHash,
            minApprovals: minApprovals,
            balance: 0
        });
        emit FundCreated(nextFundID, name, msg.sender);
        nextFundID++;
        return nextFundID-1;
    }

    // Donate to a specific fund in stablecoins
    function donateToFund(uint256 fundID, uint256 amount) external onlyFundExists(fundID) {
        require(amount > 0, "Donation must be greater than zero");
        require(stablecoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        Fund storage fund = funds[fundID];
        fund.balance += amount;

        emit DonationReceived(fundID, msg.sender, amount);
    }

    // Submit an application to a specific fund
    function submitApplication(
        uint256 fundID,
        uint256 requestedAmount,
        string memory mongoDbHash
    ) external onlyFundExists(fundID) returns (uint256) {
        Fund storage fund = funds[fundID];
        require(
            requestedAmount >= fund.minRequestAmount && requestedAmount <= fund.maxRequestAmount,
            "Requested amount out of range"
        );

        applications[nextApplicationID] = Application({
            id: nextApplicationID,
            fundID: fundID,
            applicant: msg.sender,
            requestedAmount: requestedAmount,
            approvalCount: 0,
            mongoDbHash: mongoDbHash,
            funded: false
        });

        emit ApplicationSubmitted(nextApplicationID, fundID, msg.sender);
        nextApplicationID++;
        return nextApplicationID-1;
    }

    // Approve an application
    function approveApplication(uint256 appID) external {
        Application storage app = applications[appID];
        require(app.applicant != address(0), "Application does not exist");
        require(!app.funded, "Application already funded");
        require(!applicationApprovals[appID][msg.sender], "Already approved by this reviewer");

        applicationApprovals[appID][msg.sender] = true;
        app.approvalCount++;

        emit ApplicationApproved(appID, app.approvalCount);
    }

    // Disburse funds to an approved applicant
    function disburseFunds(uint256 appID) external {
        Application storage app = applications[appID];
        Fund storage fund = funds[app.fundID];

        require(app.approvalCount >= fund.minApprovals, "Not enough approvals");
        require(fund.balance >= app.requestedAmount, "Insufficient fund balance");
        require(!app.funded, "Funds already disbursed");
        require(msg.sender == fund.owner, "Not the fund owner");

        app.funded = true;
        fund.balance -= app.requestedAmount;

        require(stablecoin.transfer(app.applicant, app.requestedAmount), "Transfer failed");

        emit FundsDisbursed(appID, app.applicant, app.requestedAmount);
    }

    // View contract's stablecoin balance
    function getContractBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }

    // View fund balance
    function getFundBalance(uint256 fundID) external view onlyFundExists(fundID) returns (uint256) {
        return funds[fundID].balance;
    }
}
