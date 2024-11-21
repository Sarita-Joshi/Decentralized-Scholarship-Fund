pragma solidity ^0.8.0;

contract ScholarshipFund {
    address public owner;
    uint256 public applicationCount;

    struct Application {
        uint256 id;
        address applicant;
        uint256 requestedAmount;
        string mongoDbHash;
        string status; //[Pending, Approved, Rejected, Funded]
    }

    mapping(uint256 => Application) public applications;

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
    }

    // Application Functions
    function submitApplication(uint256 _requestedAmount, string memory _mongoDbHash)
        external
        returns (uint256)
    {
        applicationCount++;
        applications[applicationCount] = Application(
            applicationCount,
            msg.sender,
            _requestedAmount,
            _mongoDbHash,
            "Pending"
        );
        emit ApplicationSubmitted(applicationCount, _mongoDbHash);
        return applicationCount;
    }

    function updateApplicationStatus(uint256 _id, string memory _status) external onlyOwner {
        require(_id <= applicationCount, "Application does not exist");
        applications[_id].status = _status;
        emit ApplicationStatusUpdated(_id, _status);
    }

    function getApplication(uint256 _id)
        external
        view
        returns (
            uint256,
            address,
            uint256,
            string memory,
            string memory
        )
    {
        require(_id <= applicationCount, "Application does not exist");
        Application memory app = applications[_id];
        return (
            app.id,
            app.applicant,
            app.requestedAmount,
            app.mongoDbHash,
            app.status
        );
    }

    // Donation Functions
    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        emit DonationReceived(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Disbursement Functions
    function disburseFunds(uint256 _applicationId) external onlyOwner {
        require(_applicationId <= applicationCount, "Application does not exist");
        Application storage app = applications[_applicationId];
        require(
            keccak256(bytes(app.status)) == keccak256(bytes("Approved")),
            "Application must be approved"
        );
        require(app.requestedAmount <= address(this).balance, "Insufficient funds");

        app.status = "Funded";

        (bool success, ) = app.applicant.call{value: app.requestedAmount}("");
        require(success, "Disbursement failed");
        emit FundsDisbursed(_applicationId, app.requestedAmount);
    }
}
