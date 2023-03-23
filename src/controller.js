var Web3 = require('web3');
var express = require('express');
var fs = require('fs');
var web3 = new Web3('http://localhost:8545');
var app = express();
app.use(express.json());


const landContractArtifacts = JSON.parse(fs.readFileSync('./build/contracts/LandRegistry.json'));


const landContractAddress = "0xA3777fbB9Af3d10aE9DA8b2AF762E3464a7B554d";
const landContractInstance = new web3.eth.Contract(landContractArtifacts.abi, landContractAddress);


const RegisterLand = async (req, res) => {
    let landRegID = req.body.landRegID;
    let ipfsHash = req.body.ipfsHash;
    let landAddress = req.body.landAddress;
    let amount = req.body.amount;
    let ownedBy = req.body.ownedBy;
    let isApproved = req.body.isApproved;

    const accounts = await web3.eth.getAccounts();
    const gasFee = await landContractInstance.methods.RegisterLandRecords(
        landRegID, ipfsHash, landAddress, amount, ownedBy, isApproved
    ).estimateGas({ from: accounts[0] });
    console.log("estimated Fee", gasFee);

    let txn = await landContractInstance.methods.RegisterLandRecords(
        landRegID, ipfsHash, landAddress, amount, ownedBy, isApproved).send
        ({ from: accounts[0], gas: gasFee });

    res.json({ "txn response": txn });
}

const getLandRecordDetailsByID = async (req, res) => {
    let RegID = req.body.landRegID;
    let txn = await landContractInstance.methods.getLandRecordDetailsByID(RegID).call();



    let outputObj = {
        "landRegID": txn[0],
        "ipfsHash": txn[1],
        "landAddress": txn[2],
        "amount": txn[3],
        "ownedBy": txn[4],
        "isGovtApproved": txn[5],
        "isAvailable": txn[6]
    }

    res.json({ "output": outputObj });
}

const ListLandForSale = async (req, res) => {
    let landRegID = req.body.landRegID;
    let saleAmount = req.body.saleAmount;


    const accounts = await web3.eth.getAccounts();
    const gasFee = await landContractInstance.methods.ListLandForSale(
        landRegID, saleAmount).estimateGas({ from: accounts[0] });

    let txn = await landContractInstance.methods.ListLandForSale(
        landRegID, saleAmount).send
        ({ from: accounts[0], gas: gasFee });

    res.json({ "txn response": txn });
}

const ListAllLandsListedForSale = async (req, res) => {

    let val = await landContractInstance.methods.ListAllLandsListedForSale().call();
    console.log(val);
    let landSaleArray = [];
    for (const i of val) {

        var txn = await landContractInstance.methods.getLandRecordDetailsByID(i).call();
        console.log(txn);
        let outputObj = {
            "landRegID": txn[0],
            "ipfsHash": txn[1],
            "landAddress": txn[2],
            "amount": txn[3],
            "ownedBy": txn[4],
            "isGovtApproved": txn[5],
            "isAvailable": txn[6]
        }

        landSaleArray.push(outputObj);
    }
    res.json({ "output": landSaleArray });


}

const ListAllLandRecords = async (req, res) => {

    let val = await landContractInstance.methods.ListAllLandRecords().call();
    console.log(val);
    let landArray = [];
    for (const i of val) {

        var txn = await landContractInstance.methods.getLandRecordDetailsByID(i).call();
        console.log(txn);
        let outputObj = {
            "landRegID": txn[0],
            "ipfsHash": txn[1],
            "landAddress": txn[2],
            "amount": txn[3],
            "ownedBy": txn[4],
            "isGovtApproved": txn[5],
            "isAvailable": txn[6]
        }

        landArray.push(outputObj);
    }
    res.json({ "output": landArray });


}


const quoteForLand = async (req, res) => {
    let landRegID = req.body.landRegID;
    let amount = req.body.amount;


    const accounts = await web3.eth.getAccounts();
    const gasFee = await landContractInstance.methods.quoteForLand(
        landRegID, amount).estimateGas({ from: accounts[0] });

    let txn = await landContractInstance.methods.quoteForLand(
        landRegID, amount).send
        ({ from: accounts[1], gas: gasFee });

    res.json({ "txn response": txn });
}

const listAllPurchaseRequests = async (req, res) => {

    let landRegID = req.body.landRegID;
    let txn = await landContractInstance.methods.listAllPurchaseRequests(landRegID).call();

    let outputObj = {
        "landRegID": txn[0],
        "amount": txn[1],
        "RequestedBy": txn[2],
        "timestamp": txn[3],
        "AcceptedStatus": txn[4]
    }


    res.json({ "output": outputObj });
}

const AcceptPurchaseRequest = async (req, res) => {

    let landRegID = req.body.landRegID;
    let amount = req.body.amount;
    let RequestedBy = req.body.RequestedBy;


    const accounts = await web3.eth.getAccounts();
    const gasFee = await landContractInstance.methods.AcceptPurchaseRequest(
        landRegID, RequestedBy, amount).estimateGas({ from: accounts[0] });

    let txn = await landContractInstance.methods.AcceptPurchaseRequest(
        landRegID, RequestedBy, amount).send
        ({ from: accounts[0], gas: gasFee });

    res.json({ "txn response": txn });
}

const initiatePayment = async (req, res) => {

    let landRegID = req.body.landRegID;
    let amount = req.body.amount;
    let ownerAddress = req.body.RequestedBy;


    let amountWei = web3.utils.toWei(amount.toString(), 'gwei')
    const accounts = await web3.eth.getAccounts();
    const gasFee = await landContractInstance.methods.initiatePayment(
        landRegID, ownerAddress, amountWei).estimateGas({ from: accounts[1], value: amountWei });

    let txn = await landContractInstance.methods.initiatePayment(
        landRegID, ownerAddress, amountWei).send
        ({ from: accounts[1], gas: gasFee, value: amountWei })

    res.json({ "txn response": txn });
}


const TransferLandOwnershipToBuyer = async (req, res) => {
    let landRegID = req.body.landRegID;
    let buyerAddress = req.body.buyerAddress;

    const accounts = await web3.eth.getAccounts();
    const gasFee = await landContractInstance.methods.TransferLandOwnershipToBuyer(
        landRegID, buyerAddress).estimateGas({ from: accounts[0] });

    let txn = await landContractInstance.methods.TransferLandOwnershipToBuyer(
        landRegID, buyerAddress).send
        ({ from: accounts[0], gas: gasFee });

    res.json({ "txn response": txn });
}
module.exports = {
    RegisterLand,
    getLandRecordDetailsByID,
    ListLandForSale,
    ListAllLandsListedForSale,
    ListAllLandRecords,
    quoteForLand,
    listAllPurchaseRequests,
    AcceptPurchaseRequest,
    initiatePayment,
    TransferLandOwnershipToBuyer

}
