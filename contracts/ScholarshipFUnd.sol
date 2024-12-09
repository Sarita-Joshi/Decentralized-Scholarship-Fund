// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScholarshipFund {
    address public owner;
    uint256 public applicationCount;
    uint256 public fundCount;

    struct Application {
        uint256 id;
        address applicant;
        uint256 requestedAmount;
        string mongoDbHash;
        string status; // [Pending, Approved, Rejected, Funded]
        uint256 fundId; // ID of the fund the application is tied to
        uint256 approvals; // Number of approvals received
        address[] approvers; // List of addresses who approved this application
        address[] rejectors; // List of addresses who rejected this application
    }

    struct Fund {
        uint256 id;
        address fundOwner;
        uint256 balance;
        uint256 minApprovals;
        string name;
        bool approved; // Whether the fund is approved by the contract owner
        address[] reviewers; // List of reviewer addresses for this fund (empty means open to all)
    }

    mapping(uint256 => Application) public applications;
    mapping(uint256 => Fund) public funds;
    mapping(uint256 => mapping(address => bool)) public hasReviewed; // Tracks if a reviewer has already reviewed an application

    event ApplicationSubmitted(uint256 id, string mongoDbHash);
    event ApplicationStatusUpdated(uint256 id, string status);
    event FundsDisbursed(uint256 applicationId, uint256 amount);
    event DonationReceived(address donor, uint256 fundId, uint256 amount);
    event FundCreated(uint256 id, address fundOwner, string name);
    event FundApproved(uint256 fundId, bool approved);
    event ApplicationReviewed(
        uint256 applicationId,
        address reviewer,
        string action
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyFundOwner(uint256 _fundId) {
        require(
            funds[_fundId].fundOwner == msg.sender,
            "Only the fund owner can perform this action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // Application Functions
    function submitApplication(
        uint256 _requestedAmount,
        string memory _mongoDbHash,
        uint256 _fundId
    ) external returns (uint256) {
        require(_fundId <= fundCount, "Fund does not exist");

        applicationCount++;
        applications[applicationCount] = Application(
            applicationCount,
            msg.sender,
            _requestedAmount,
            _mongoDbHash,
            "Pending",
            _fundId,
            0,
            new address[](0),
            new address[](0)
        );
        emit ApplicationSubmitted(applicationCount, _mongoDbHash);
        return applicationCount;
    }

    function updateApplicationStatus(
        uint256 _id,
        bool approve
    ) external onlyOwner {
        require(_id <= applicationCount, "Application does not exist");
        string memory _status = "Rejected";
        if (approve) {
            _status = "Approved";
        }
        applications[_id].status = _status;
        emit ApplicationStatusUpdated(_id, _status);
    }

    function reviewApplication(uint256 _applicationId, bool approve) external {
        require(
            _applicationId <= applicationCount,
            "Application does not exist"
        );
        Application storage app = applications[_applicationId];
        Fund storage fund = funds[app.fundId];

        // Check if the fund is open to all or the reviewer is specified
        require(
            fund.reviewers.length == 0 || isReviewer(app.fundId, msg.sender),
            "You are not authorized to review this application"
        );

        require(
            !hasReviewed[_applicationId][msg.sender],
            "Already reviewed this application"
        );

        hasReviewed[_applicationId][msg.sender] = true;

        if (approve) {
            app.approvals++;
            app.approvers.push(msg.sender);
            emit ApplicationReviewed(_applicationId, msg.sender, "Approved");
        } else {
            app.rejectors.push(msg.sender);
            emit ApplicationReviewed(_applicationId, msg.sender, "Rejected");
        }

        // Automatically set status to "Approved" if minimum approvals are met
        if (app.approvals >= fund.minApprovals) {
            app.status = "Approved";
            emit ApplicationStatusUpdated(_applicationId, "Approved");
        }
    }

    function getApplication(
        uint256 _id
    ) external view returns (Application memory) {
        require(_id <= applicationCount, "Application does not exist");
        Application memory app = applications[_id];
        return app;
    }

    // Fund Functions
    function createFund(
        string memory _name,
        uint256 _minApprovals,
        address[] memory _reviewers
    ) external payable returns (uint256) {
        fundCount++;
        funds[fundCount] = Fund(
            fundCount,
            msg.sender,
            msg.value,
            _minApprovals,
            _name,
            false,
            _reviewers
        );
        emit FundCreated(fundCount, msg.sender, _name);
        return fundCount;
    }

    function approveFund(uint256 _fundId) external onlyOwner {
        require(_fundId <= fundCount, "Fund does not exist");
        Fund storage fund = funds[_fundId];
        fund.approved = true;
        emit FundApproved(_fundId, true);
    }

    function donateToFund(uint256 _fundId) external payable {
        require(_fundId <= fundCount, "Fund does not exist");
        require(msg.value > 0, "Donation must be greater than 0");

        Fund storage fund = funds[_fundId];
        fund.balance += msg.value;

        emit DonationReceived(msg.sender, _fundId, msg.value);
    }

    function getFund(uint256 _fundId) external view returns (Fund memory) {
        require(_fundId <= fundCount, "Fund does not exist");
        Fund memory fund = funds[_fundId];
        return fund;
    }

    function disburseFunds(uint256 _applicationId) external onlyOwner {
        require(
            _applicationId <= applicationCount,
            "Application does not exist"
        );
        Application storage app = applications[_applicationId];

        require(app.fundId <= fundCount, "Invalid fund ID"); // Check that the fund exists

        require(
            keccak256(bytes(app.status)) == keccak256(bytes("Approved")),
            "Application must be approved"
        );
        require(
            app.requestedAmount <= funds[app.fundId].balance,
            "Insufficient funds in the fund"
        );

        app.status = "Funded";
        funds[app.fundId].balance -= app.requestedAmount; // Deduct the amount from the specific fund

        (bool success, ) = app.applicant.call{value: app.requestedAmount}("");
        require(success, "Disbursement failed");

        emit FundsDisbursed(_applicationId, app.requestedAmount);
    }

    // Helper Functions
    function isReviewer(
        uint256 _fundId,
        address _reviewer
    ) internal view returns (bool) {
        Fund memory fund = funds[_fundId];
        for (uint256 i = 0; i < fund.reviewers.length; i++) {
            if (fund.reviewers[i] == _reviewer) {
                return true;
            }
        }
        return false;
    }

    function addReviewer(
        uint256 _fundId,
        address _reviewer
    ) external onlyFundOwner(_fundId) {
        // Access the fund in storage
        Fund storage fund = funds[_fundId];
        fund.reviewers.push(_reviewer); // Add the reviewer to the reviewers array
    }
}
