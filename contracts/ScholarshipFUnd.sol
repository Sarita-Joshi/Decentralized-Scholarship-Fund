pragma solidity ^0.8.0;

import "./DonationContract.sol";
import "./ApplicationContract.sol";
import "./DisbursementContract.sol";

contract ScholarshipFund {
    address public owner;
    DonationContract public donationContract;
    ApplicationContract public applicationContract;
    DisbursementContract public disbursementContract;

    event ApplicationSubmitted(uint256 id, string mongoDbHash);
    event ApplicationStatusUpdated(uint256 id, string status);
    event FundsDisbursed(uint256 applicationId, uint256 amount);
    event DonationReceived(address donor, uint256 amount);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        donationContract = new DonationContract();
        applicationContract = new ApplicationContract();
        disbursementContract = new DisbursementContract();
    }

    // Function to accept donations
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than zero");
        donationContract.donate{ value: msg.value }();
        emit DonationReceived(msg.sender, msg.value);
    }

    // Function to get total donations
    function getTotalDonations() external view returns (uint256) {
        return donationContract.getTotalDonations();
    }

    // Functions to interact with ApplicationContract
    function submitApplication( uint256 _requestedAmount, string memory _mongoDbHash) external returns (uint256){
        uint256 app_id = applicationContract.submitApplication(_requestedAmount, _mongoDbHash);
        emit ApplicationSubmitted(app_id, _mongoDbHash);
        return app_id;
    }

    function updateApplicationStatus(uint256 _id, string memory _status) external onlyOwner {
        applicationContract.updateApplicationStatus(_id, _status);
        emit ApplicationStatusUpdated(_id, _status);
    }

    // Function to fund the Disbursement Contract
    function fundDisbursementContract() external payable onlyOwner {
        require(msg.value > 0, "Amount must be greater than zero");
        payable(address(disbursementContract)).transfer(msg.value);
    }

    // Function to disburse funds to an approved applicant
    function disburseFunds(uint256 _applicationId) external onlyOwner {
        // Get application details from ApplicationContract
        (, address applicant, uint256 requestedAmount, , string memory status) = applicationContract.applications(_applicationId);

        require(keccak256(bytes(status)) == keccak256(bytes("Approved")), "Application is not approved");

        // Call disburseFunds on DisbursementContract
        disbursementContract.disburseFunds( payable(applicant), requestedAmount);
        emit FundsDisbursed(_applicationId, requestedAmount);
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    // Function to get balance of DisbursementContract
    function getDisbursementBalance() external view returns (uint256) {
        return disbursementContract.getBalance();
    }
}
