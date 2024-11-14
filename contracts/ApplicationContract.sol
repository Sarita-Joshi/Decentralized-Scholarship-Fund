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

    mapping(uint256 => Application) public applications;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function submitApplication(uint256 _requestedAmount, string memory _mongoDbHash) external returns (uint256){
        applicationCount++;
        applications[applicationCount] = Application(applicationCount, msg.sender, _requestedAmount, _mongoDbHash, "Pending");
        return applicationCount;
    }

    function updateApplicationStatus(uint256 _id, string memory _status) external onlyOwner {
        require(_id <= applicationCount, "Application does not exist");
        applications[_id].status = _status;
    }


}
