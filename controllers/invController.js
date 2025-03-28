const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    if (!classification_id || isNaN(classification_id)) {
      return next({ status: 404, message: "Classification not found"})
    }
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) {
      return next({ status: 404, message: "No Inventory item with this Classification type" });
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name 
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error);
  }
  
}

/******************************
 * Build vehicle page by vehicle ID
 *****************************/
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId
    if (!inventory_id || isNaN(inventory_id)) {
      return next({ status: 404, message: "Inventory item not found"})
    }
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    if (!data) {
      return next({ status: 404, message: "Inventory item not found" });
    }
    const card = await utilities.buildInventoryCard(data)
    let nav = await utilities.getNav()
    const className = data.inv_make + ' ' + data.inv_model
    res.render("./inventory/inventoryItem", {
      title: className,
      nav,
      card,
    })
  } catch (error) {
    next(error)
  }  
}

/**********************************
 * Build management view
 **********************************/
invCont.buildManagement = async function(req, res, nex) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

/**********************************
 * Build Add Classification view
 **********************************/
invCont.buildAddClassification = async function(req, res, nex) {
  let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
      })
    }

/**********************************
 * Build Add Inventory view
 **********************************/
invCont.buildAddInventory = async function(req, res, nex) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationSelect,
        errors: null
      })
    }

invCont.AddClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const regResult = await invModel.addClassification(classification_name)
  if(regResult){
    req.flash(
      "notice",
      `Congratulations, you've added a new classification type.`
    )
    res.redirect("/inv") 
  } else {
    req.flash("error", "There was an issue adding the classification.");
    res.redirect("/inv/add-classification");
  }
}

invCont.AddInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const {
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
  } = req.body
  const regResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
  if(regResult){
    req.flash(
      "notice",
      `Congratulations, you've added a new inventory item.`
    )
    res.redirect("/inv") 
  } else {
    req.flash("error", "There was an issue adding the inventory item.");
    res.redirect("/inv/add-inventory");
  }
}

module.exports = invCont