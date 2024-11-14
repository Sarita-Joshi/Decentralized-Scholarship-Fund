// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DonationContract.sol";
import "./ApplicationContract.sol";
import "./DisbursementContract.sol";

contract ScholarshipFund {
    address public owner;
    DonationContract public donationContract;
    ApplicationContract public applicationContract;
    DisbursementContract public disbursementContract;

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
    }

    // Function to get total donations
    function getTotalDonations() external view returns (uint256) {
        return donationContract.getTotalDonations();
    }

    // Functions to interact with ApplicationContract
    function submitApplication( uint256 _requestedAmount, string memory _mongoDbHash) external {
        applicationContract.submitApplication(_requestedAmount, _mongoDbHash);
    }

    function updateApplicationStatus(address applicantAddress, string memory _status) external onlyOwner {
        applicationContract.updateApplicationStatus(applicantAddress, _status);
    }

    // Function to fund the Disbursement Contract
    function fundDisbursementContract() external payable onlyOwner {
        require(msg.value > 0, "Amount must be greater than zero");
        payable(address(disbursementContract)).transfer(msg.value);
    }

    // Function to disburse funds to an approved applicant
    function disburseFunds(address applicantAddress) external onlyOwner {
        // Get application details from ApplicationContract
        (, address applicant, uint256 requestedAmount, , string memory status) = applicationContract.applications(applicantAddress);

        require(keccak256(bytes(status)) == keccak256(bytes("Approved")), "Application is not approved");

        // Call disburseFunds on DisbursementContract
        disbursementContract.disburseFunds(applicantAddress, payable(applicant), requestedAmount);
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    // Function to get balance of DisbursementContract
    function getDisbursementBalance() external view returns (uint256) {
        return disbursementContract.getBalance();
    }
}
