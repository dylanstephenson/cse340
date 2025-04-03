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
  const classificationSelect = await utilities.buildClassificationList()

  if (!res.locals.accountData) {
    req.flash("notice", "You must be logged in to access that page.");
    return res.redirect("/account/login");
  }

  const accountType = res.locals.accountData.account_type;
  if (res.locals.loggedin && accountType !== "Client") {
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null
    })
  } else {
    req.flash("error", "You do not have access to that page.");
    return res.redirect("/account/login");
  }
}
  

/**********************************
 * Build Add Classification view
 **********************************/
invCont.buildAddClassification = async function(req, res, nex) {
  let nav = await utilities.getNav()

  if (!res.locals.accountData) {
    req.flash("notice", "You must be logged in to access that page.");
    return res.redirect("/account/login");
  }

  const accountType = res.locals.accountData.account_type;
  if (res.locals.loggedin && accountType !== "Client") {
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("error", "You do not have access to that page.");
    return res.redirect("/account/login");
  }
}
      

/**********************************
 * Build Add Inventory view
 **********************************/
invCont.buildAddInventory = async function(req, res, nex) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()

  if (!res.locals.accountData) {
    req.flash("notice", "You must be logged in to access that page.");
    return res.redirect("/account/login");
  }

  const accountType = res.locals.accountData.account_type;
  if (res.locals.loggedin && accountType !== "Client") {
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null
    })
  } else {
    req.flash("error", "You do not have access to that page.");
    return res.redirect("/account/login");
  }
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Build the edit inventory view, name isn't very good and should be changed.
invCont.modifyInventory = async function(req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`    
  res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
      })
    }

    invCont.updateInventory = async function(req, res) {
      let nav = await utilities.getNav()
      const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
      } = req.body
      const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
      if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
      } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
        })
    }
  }

module.exports = invCont