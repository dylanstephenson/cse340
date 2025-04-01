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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventory_id", utilities.handleErrors(invController.modifyInventory))

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

// Update inventory
router.post(
    '/update/',
    validate.inventoryRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;
