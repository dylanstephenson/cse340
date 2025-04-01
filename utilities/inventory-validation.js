const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .matches(/^[A-Za-z]\S{4,}$/)
    .isLength({ min: 1 })
    .withMessage("please provide a name with no spaces.") // on error this message is sent.
]}

validate.checkClassData = async (req, res, next) => {
    const classification_name = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

validate.inventoryRules = () => {
  return [
  body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please select a classification."), // on error this message is sent.
  
  body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide vehicle make."), // on error this message is sent.
  // valid email is required and cannot already exist in the DB
  body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2})
    .withMessage("Please provide a vehicle model."),
  // password is required and must be strong password
  body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2})
    .withMessage("Please provide a vehicle description."),

  body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2})
    .withMessage("Please provide an image path."),
  
  body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2})
    .withMessage("Please provide a thumbnail."),

  body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 3})
    .withMessage("Price is required and must be a number."),
  
  body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isInt()
    .matches(/^[0-9]+$/)
    .isLength({ min: 4, max: 4})
    .withMessage("Year must be four digits and is required"),
  
  body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isInt()
    .matches(/^[0-9]+$/)
    .isLength({ min: 4})
    .withMessage("Miles must be in whole numbers with no special characters and is required"),
  
  body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2})
    .withMessage("Please provide vehicle color"),
    ]}// on error this message is sent.

validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationSelect = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classificationSelect,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      })
      return
    }
    next()
  }

  validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationSelect = await utilities.buildClassificationList()
      res.render("./inventory/edit-inventory", {
        errors,
        title: "Edit Inventory",
        nav,
        classificationSelect,
        classification_id,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      })
      return
    }
    next()
  }
  
  module.exports = validate