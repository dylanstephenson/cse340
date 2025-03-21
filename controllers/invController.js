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
      return next({ status: 404, message: "Classification not found" });
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


module.exports = invCont