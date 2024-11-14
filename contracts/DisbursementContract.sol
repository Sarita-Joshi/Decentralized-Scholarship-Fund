// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisbursementContract {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to disburse funds to approved applicants
    function disburseFunds(address payable recipient, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance for disbursement");
        require(amount > 0, "Amount must be greater than zero");

        recipient.transfer(amount);
        //emit FundsDisbursed(applicationId, recipient, amount);
    }

    // Function to allow the controller contract to deposit funds
    receive() external payable {}

    // Function to get the balance of the disbursement contract
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}