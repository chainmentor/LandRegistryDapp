// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract LandRegistry {
    address platformOwner;

    struct LandRecordData {
        uint256 landRegID;
        string ipfsHash;
        string landAddress;
        uint256 amount;
        address payable ownedBy;
        bool isGovtApproved;
        bool isAvailable;
    }

    struct LandSaleRecord {
        uint256 landRegID;
        bool saleStatus;
        uint256 saleAmount;
        address ListedBy;
        uint256 timestamp;
    }

    struct LandPurchaseRequest {
        uint256 landRegID;
        uint256 amount;
        address requestedBy;
        uint256 timestamp;
        bool Accepted;
        bool paymentStatus;
        address PaymentFrom;
    }

    /*
Event Definitions


*/

    event LandRegistered(
        uint256 indexed landRegID,
        address indexed LandRegisteredBy,
        uint256 timestamp
    );
    event LandListedForSale(
        uint256 indexed landRegID,
        address indexed ListedBy,
        uint256 amount,
        uint256 timestamp
    );
    event LandPurchaseRequested(
        uint256 indexed landRegID,
        address indexed RequestedBy,
        uint256 offeredAmount,
        uint256 timestamp
    );
    event LandPurchaseAgreementAccepted(
        uint256 indexed landRegID,
        address indexed RequestedBy,
        address indexed AcceptedBy,
        uint256 offeredAmount,
        uint256 timestamp
    );
    event OwnershipTransferred(
        uint256 indexed landRegID,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );
    event PaymentSuccessful(
        uint256 indexed landRegID,
        address indexed paymentFrom,
        address indexed paymentTo,
        uint256 amount,
        uint256 timestamp
    );

    /*
Mapping Definitions
*/
    mapping(uint256 => LandRecordData) landIdDataMap;
    mapping(uint256 => LandSaleRecord) landIdSaleMap;
    mapping(uint256 => LandPurchaseRequest) landPurchaseMap;

    /*
Array Declarations

*/
    uint256[] public landIDArray;
    uint256[] public landForSaleArray;

    /*
uint256
Function Definitions

*/

    function RegisterLandRecords(
        uint256 _landRegID,
        string memory _ipfsHash,
        string memory _landAddress,
        uint256 _amount,
        address _ownedBy,
        bool _isGovtApproved
    ) public returns (bool) {
        LandRecordData storage landObj = landIdDataMap[_landRegID];
        landObj.landRegID = _landRegID;
        landObj.ipfsHash = _ipfsHash;
        landObj.landAddress = _landAddress;
        landObj.amount = _amount;
        landObj.ownedBy = payable(_ownedBy);
        landObj.isGovtApproved = _isGovtApproved;
        landObj.isAvailable = true;
        landIDArray.push(_landRegID);
        emit LandRegistered(_landRegID, msg.sender, block.timestamp);
        return true;
    }

    function getLandRecordDetailsByID(
        uint256 _landRegID
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            address,
            bool,
            bool
        )
    {
        LandRecordData memory landObj = landIdDataMap[_landRegID];

        return (
            landObj.landRegID,
            landObj.ipfsHash,
            landObj.landAddress,
            landObj.amount,
            landObj.ownedBy,
            landObj.isGovtApproved,
            landObj.isAvailable
        );
    }

    function ListLandForSale(
        uint256 _landRegID,
        uint256 _saleAmount
    ) public returns (bool) {
        LandSaleRecord storage saleObj = landIdSaleMap[_landRegID];
        saleObj.saleStatus = true;
        saleObj.saleAmount = _saleAmount;
        saleObj.ListedBy = msg.sender;

        landForSaleArray.push(_landRegID);

        emit LandListedForSale(
            _landRegID,
            msg.sender,
            _saleAmount,
            block.timestamp
        );
        return true;
    }

    function ListAllLandsListedForSale()
        public
        view
        returns (uint256[] memory)
    {
        return landForSaleArray;
    }

    function ListAllLandRecords() public view returns (uint256[] memory) {
        return landIDArray;
    }

    function quoteForLand(
        uint256 _landRegID,
        uint256 _amount
    ) public returns (bool) {
        LandPurchaseRequest storage pObj = landPurchaseMap[_landRegID];
        pObj.landRegID = _landRegID;
        pObj.amount = _amount;
        pObj.requestedBy = msg.sender;
        pObj.timestamp = block.timestamp;

        emit LandPurchaseRequested(
            _landRegID,
            msg.sender,
            _amount,
            block.timestamp
        );

        return true;
    }

    function listAllPurchaseRequests(
        uint256 _landRegID
    ) public view returns (uint256, uint256, address, uint256, bool) {
        LandPurchaseRequest memory pObj = landPurchaseMap[_landRegID];
        return (
            pObj.landRegID,
            pObj.amount,
            pObj.requestedBy,
            pObj.timestamp,
            pObj.Accepted
        );
    }

    function AcceptPurchaseRequest(
        uint256 _landRegID,
        address _RequestedBy,
        uint256 _amount
    ) public returns (bool) {
        LandPurchaseRequest storage lObj = landPurchaseMap[_landRegID];
        lObj.Accepted = true;
        emit LandPurchaseAgreementAccepted(
            _landRegID,
            _RequestedBy,
            msg.sender,
            _amount,
            block.timestamp
        );
        return true;
    }

    function initiatePayment(
        uint256 _landRegID,
        address _ownerAddress,
        uint256 _amount
    ) public payable  returns (bool) {
        bool sent = payable(_ownerAddress).send(msg.value);
        require(sent, "Payment Failed");
        LandPurchaseRequest storage lObj = landPurchaseMap[_landRegID];
        lObj.paymentStatus = true;
        lObj.PaymentFrom = msg.sender;
        emit PaymentSuccessful(
            _landRegID,
            msg.sender,
            _ownerAddress,
            _amount,
            block.timestamp
        );
        return true;
    }

    function TransferLandOwnershipToBuyer(
        uint256 _landRegID,
        address _buyerAddress
    ) public returns (bool) {
        LandRecordData storage landObj = landIdDataMap[_landRegID];
        landObj.ownedBy = payable(_buyerAddress);
        landObj.isAvailable = false;
        emit OwnershipTransferred(
            _landRegID,
            msg.sender,
            _buyerAddress,
            block.timestamp
        );
        return true;
    }
}
