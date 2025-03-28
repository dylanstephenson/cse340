// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const validate = require("../utilities/inventory-validation");
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/", invController.buildManagement);
router.get("/add-classification", invController.buildAddClassification);
router.get("/add-inventory", invController.buildAddInventory)

// error handler for invalid routes
router.use(baseController.handleErrors);

// add classification
router.post(
    '/add-classification',
    validate.classificationRules(),
    validate.checkClassData,
    utilities.handleErrors(invController.AddClassification))

// add to inventory
router.post(
    '/add-inventory',
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.AddInventory))

module.exports = router;
