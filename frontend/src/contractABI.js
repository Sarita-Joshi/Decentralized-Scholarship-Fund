import ScholarshipFund from "./contracts/ScholarshipFund.json";
import DonationContract from "./contracts/DonationContract.json";
import ApplicationContract from "./contracts/ApplicationContract.json";
import DisbursementContract from "./contracts/DisbursementContract.json";

const networkId = "5777";

const getAddress = (contractJson) => {
    return contractJson.networks[networkId]?.address || null;
};

export const ScholarshipFundAddress = getAddress(ScholarshipFund);
export const DonationContractAddress = getAddress(DonationContract);
export const ApplicationContractAddress = getAddress(ApplicationContract);
export const DisbursementContractAddress = getAddress(DisbursementContract);

export const ScholarshipFundABI = ScholarshipFund.abi;
export const DonationContractABI = DonationContract.abi;
export const ApplicationContractABI = ApplicationContract.abi;
export const DisbursementContractABI = DisbursementContract.abi;
