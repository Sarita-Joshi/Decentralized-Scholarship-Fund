// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ApplicationContract {
    address public owner;
    uint256 public applicationCount;

    struct Application {
        uint256 id;
        address applicant;
        uint256 requestedAmount;
        string mongoDbHash;
        string status;
    }

    mapping(address => Application) public applications;

    event ApplicationSubmitted(address applicant, uint256 amount, string mongoDbHash);
    event ApplicationStatusUpdated(address applicant, string status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function submitApplication( uint256 _requestedAmount, string memory _mongoDbHash) external {
        applicationCount++;
        applications[msg.sender] = Application(applicationCount, msg.sender, _requestedAmount, _mongoDbHash, "Pending");
        emit ApplicationSubmitted(msg.sender, _requestedAmount, _mongoDbHash);
    }

    function updateApplicationStatus(address applicantAddress, string memory _status) external onlyOwner {
        require(bytes(applications[applicantAddress].status).length > 0, "Application does not exist");
        applications[applicantAddress].status = _status;
        emit ApplicationStatusUpdated(applicantAddress, _status);
    }


}
