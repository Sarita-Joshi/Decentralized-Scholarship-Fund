// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScholarshipFund {
    address public owner;
    uint256 public applicationCount = 0;
    uint256 public totalDonations = 0;

    struct Application {
        uint256 id;
        address applicant;
        uint256 requestedAmount;
        string mongoDbHash; // Reference to MongoDB record
        string status; // "Pending", "Approved", "Rejected"
    }

    struct Donation {
        address donor;
        uint256 amount;
    }

    mapping(uint256 => Application) public applications;
    Donation[] public donations;

    event ApplicationSubmitted(
        uint256 id,
        address applicant,
        uint256 amount,
        string mongoDbHash
    );
    event ApplicationStatusUpdated(uint256 id, string status);
    event DonationReceived(address donor, uint256 amount);
    event FundsDisbursed(uint256 id, address recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    // Function to submit an application
    function submitApplication(
        uint256 _requestedAmount,
        string memory _mongoDbHash
    ) external {
        applicationCount++;
        applications[applicationCount] = Application(
            applicationCount,
            msg.sender,
            _requestedAmount,
            _mongoDbHash,
            "Pending"
        );

        emit ApplicationSubmitted(
            applicationCount,
            msg.sender,
            _requestedAmount,
            _mongoDbHash
        );
    }

    // Function to update application status
    function updateApplicationStatus(
        uint256 _id,
        string memory _status
    ) external onlyOwner {
        require(
            bytes(applications[_id].status).length > 0,
            "Application does not exist"
        );
        applications[_id].status = _status;

        emit ApplicationStatusUpdated(_id, _status);
    }

    // Donation function to accept contributions
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than zero");
        donations.push(Donation({donor: msg.sender, amount: msg.value}));
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    // New getter function for total donations
    function getTotalDonations() external view returns (uint256) {
        return totalDonations;
    }

    // Function to disburse funds to an approved application
    function disburseFunds(uint256 _id) external onlyOwner {
        Application storage application = applications[_id];
        require(
            keccak256(bytes(application.status)) ==
                keccak256(bytes("Approved")),
            "Application is not approved"
        );
        require(
            application.requestedAmount <= address(this).balance,
            "Insufficient contract balance"
        );

        // Transfer funds
        payable(application.applicant).transfer(application.requestedAmount);
        application.status = "Funded";

        emit FundsDisbursed(
            application.id,
            application.applicant,
            application.requestedAmount
        );
    }

    // Get the list of donations
    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }
}
