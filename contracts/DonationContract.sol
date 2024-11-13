// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationContract {
    address public owner;
    uint256 public totalDonations;

    event DonationReceived(address donor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than zero");
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function getTotalDonations() external view returns (uint256) {
        return totalDonations;
    }
}
