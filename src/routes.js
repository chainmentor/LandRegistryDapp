var express = require('express');
var app = express();
app.use(express.json());

const LandController = require('./controller.js');

const router = express.Router();

router.post('/RegisterLand',LandController.RegisterLand);
router.post('/getLandRecordDetailsByID',LandController.getLandRecordDetailsByID);
router.post('/ListLandForSale',LandController.ListLandForSale);
router.post('/ListAllLandsListedForSale',LandController.ListAllLandsListedForSale);
router.post('/ListAllLandRecords',LandController.ListAllLandRecords);
router.post('/quoteForLand',LandController.quoteForLand);
router.post('/listAllPurchaseRequests',LandController.listAllPurchaseRequests);
router.post('/AcceptPurchaseRequest',LandController.AcceptPurchaseRequest);
router.post('/initiatePayment',LandController.initiatePayment);
router.post('/TransferLandOwnershipToBuyer',LandController.TransferLandOwnershipToBuyer);


module.exports = router;