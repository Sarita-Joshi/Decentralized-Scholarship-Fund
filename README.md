## EduFund - Scholarship Fund DApp

The Scholarship Fund DApp is a decentralized application designed to manage scholarship funds using blockchain technology. As an international student, I have personally experienced the financial and logistical hardships students face. These experiences inspired me to develop a platform that brings transparency, security, and efficiency to scholarship fund management. 

This project is **implemented entirely from scratch** and is an original creation, not based on any existing projects. It showcases an understanding of blockchain technology, smart contract development, and user-centric design principles, tailored to address the unique challenges faced by students, donors, and reviewers. Below are the key features of the system:

Team-
Sarita Joshi\
saritajoshi@csu.fullerton.edu\
CWID - 884441866


### 1\. Smart Contract Design

-   **Comprehensive Functionality**: The smart contract handles the entire lifecycle of scholarship applications, fund creation, donations, and reviews, ensuring decentralized and automated processes.
-   **Dynamic Reviewer List Updates**: Enables the contract to dynamically manage the list of reviewers for each fund, ensuring flexibility and adaptability.
-   **Automatic Status Updates**: Applications are automatically updated to "Approved" once a configurable minimum number of approvals is reached, reducing manual oversight.

### 2\. Security Features

-   **Access Controls**: Implements stringent role-based access controls:
    -   Only the contract owner can perform administrative actions, such as fund disbursement.
    -   Only fund owners can manage and monitor their respective funds.
-   **No Repeat Reviews**: Ensures reviewers cannot review the same application multiple times, maintaining fairness and accountability.
-   **Transparent Workflow**: All transactions, reviews, and approvals are stored immutably on the blockchain, providing verifiable and tamper-proof records.

### 3\. Role-Based Features

-   **For Applicants**:
    -   Simplifies the process of applying for scholarships with a user-friendly interface.
    -   Provides real-time updates on the status of applications to keep students informed.
-   **For Donors**:
    -   Facilitates the creation of funds and allows targeted contributions.
    -   Provides detailed insights into fund contributions and associated applications for better tracking.
-   **For Reviewers**:
    -   Tracks reviewer actions for accountability and ensures no duplication in reviews.
    -   Offers an intuitive interface for approving or rejecting applications.
-   **For Contract Owners**:
    -   Aggregates critical data such as total funds, applications, and reviews for better decision-making.
    -   Enables efficient fund disbursement while maintaining control over the system.

### 4\. Gas Optimization

-   **Cost Efficiency**: Optimized smart contract logic ensures minimal gas consumption for operations like application reviews and fund contributions.
-   **Efficient Design**: Uses advanced Solidity techniques to reduce computational overhead and improve transaction speed.

### 5\. User Interface and Experience

-   **Ease of Use**: Designed with simplicity in mind, making fund creation, application submission, and review processes straightforward.
-   **Real-Time Updates**: Ensures the frontend and backend are synchronized to reflect user actions and status changes immediately.
-   **Scalable Architecture**: Built to handle a growing number of users and transactions while maintaining performance.

This project combines cutting-edge technology with personal experience and empathy to deliver a platform that empowers students, donors, and reviewers. It provides a transparent, secure, and user-friendly solution for managing scholarship funds efficiently.

* * * * *

### Project Setup


### Prerequisites

Ensure the following tools are installed on your system:

-   **Node.js** (version 14 or higher): Install from the official Node.js website.
-   **Truffle**: Install globally using `npm install -g truffle`.
-   **MongoDB**: Install MongoDB locally or use a cloud database such as MongoDB Atlas.
-   **Ganache**: Download and install Ganache for local blockchain development.
-   **MetaMask**: Add MetaMask as a browser extension and configure it for local development.

* * * * *

### Step 1: Clone the Repository

Clone the project repository and navigate to the project directory.

```
git clone https://github.com/Sarita-Joshi/Decentralized-Scholarship-Fund.git
```

* * * * *

### Step 2: Backend Setup

1.  Navigate to the backend directory `cd backend`.
2.  Install the backend dependencies using `npm install`.
3.  Create a .env file in the backend directory with the following content:
    -   Mongo_URI - connection string of mongodb instance.
    -   PORT - port number.
4.  Optionally, run seedData.js to populate the database or blockchain with initial test data.
5.  Start the backend server by running `node server.js`.

![alt text](docs/image-1.png)

#### MongoDB Setup

1.  **Local MongoDB**:

    -   Install MongoDB from the [official website](https://www.mongodb.com/try/download/community).
    -   Start the MongoDB server on your local machine:
        -   Default port: 27017.
    -   Use the connection string: `mongodb://localhost:27017/scholarshipFund`.
2.  **MongoDB Atlas** (Cloud Database):

    -   Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    -   Create a new cluster and database.
    -   Obtain the connection string and add it to your `.env` file under `MONGODB_URI`.
    -   Example connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/scholarshipFund?retryWrites=true&w=majority`.
3.  Verify that the backend connects to MongoDB successfully by checking the logs in the terminal when running `server.js`.

![alt text](docs/image.png)

* * * * *

### Step 3: Smart Contract Setup

1.  Compile the smart contracts by running `truffle compile`.
2.  Deploy the smart contracts by running `truffle migrate --network development`.
3.  Verify that the contract is deployed successfully. Copy the deployed contract address to use in the .env files for both the frontend and backend.

* * * * *

### Step 4: Frontend Setup

1.  Navigate to the frontend directory `cd frontend`.
2.  Install the frontend dependencies using `npm install`.
3.  Copy the json file in `build/contract/ScholarshipFund.json` to contracts folder in `frontend/src/contracts/ScholarshipFund.json`. This is essential to get latest contract address, ABI.
4.  Start the React app using `npm start`. The app will open in your default browser.

* * * * *

### Step 5: Testing

#### Unit Testing with Truffle

1.  Test file is in test/ScholarshipFund.test.js.
2.  Run the tests using `truffle test`.

![alt text](docs/image-2.png)

#### App Journey

1.  Open the application in your browser.
2.  Connect MetaMask to the local blockchain (Ganache).
3.  Test features such as creating funds, applying for scholarships, donating funds, and reviewing applications.

![alt text](docs/image-3.png)

![alt text](docs/image-4.png)

![alt text](docs/image-5.png)

-------------------
Directory Structure

scholarship-fund-dapp/

-   backend/: Backend server
    -   .env: Environment variables
    -   package.json: Backend dependencies
    -   server.js: Backend server file
    -   seedData.js: Script to seed initial data
-   build/contracts/: Compiled contracts
-   contracts/: Solidity smart contracts
-   frontend/: React frontend
    -   .env: Frontend environment variables
    -   public/: Static files
    -   src/: React components
    -   package.json: Frontend dependencies
-   migrations/: Deployment scripts
-   test/: Smart contract tests
-   truffle-config.js: Truffle configuration
-   README.md: Project documentation

----------------
Technology Stack


-   **Frontend**: React, Ethers.js
-   **Backend**: Node.js, Solidity
-   **Blockchain**: Ethereum, Truffle, Ganache
-   **Wallet**: MetaMask


