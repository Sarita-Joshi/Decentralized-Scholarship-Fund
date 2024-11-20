import ScholarshipFund from "./contracts/ScholarshipFund.json";

const networkId = "5777";

const getAddress = (contractJson) => {
    return contractJson.networks[networkId]?.address || null;
};

export const ScholarshipFundAddress = getAddress(ScholarshipFund);

export const ScholarshipFundABI = ScholarshipFund.abi;
