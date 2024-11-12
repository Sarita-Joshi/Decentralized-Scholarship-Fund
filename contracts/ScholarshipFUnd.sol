// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScholarshipFund {
    address public owner;
    uint256 public totalFunds;

    struct Student {
        address studentAddress;
        string name;
        uint256 requestedAmount;
        bool approved;
        bool receivedFunds;
    }

    Student[] public students;
    mapping(address => uint256) public donations;

    event DonationReceived(address donor, uint256 amount);
    event StudentApplied(address student, string name, uint256 amount);
    event FundsDisbursed(address student, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than zero.");
        donations[msg.sender] += msg.value;
        totalFunds += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function applyForScholarship(string memory _name, uint256 _amount) external {
        require(_amount > 0, "Requested amount must be greater than zero.");
        students.push(Student({
            studentAddress: msg.sender,
            name: _name,
            requestedAmount: _amount,
            approved: false,
            receivedFunds: false
        }));
        emit StudentApplied(msg.sender, _name, _amount);
    }

    function approveScholarship(uint256 studentIndex) external onlyOwner {
        Student storage student = students[studentIndex];
        require(!student.approved, "Scholarship already approved.");
        require(totalFunds >= student.requestedAmount, "Insufficient funds.");

        student.approved = true;
        totalFunds -= student.requestedAmount;
        payable(student.studentAddress).transfer(student.requestedAmount);
        student.receivedFunds = true;

        emit FundsDisbursed(student.studentAddress, student.requestedAmount);
    }

    function getStudents() external view returns (Student[] memory) {
        return students;
    }
}
