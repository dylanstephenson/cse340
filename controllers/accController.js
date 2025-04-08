const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accController.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
accController.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

accController.buildAccountManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })
}

accController.buildAdmin = async function(req, res, next) {
  let nav = await utilities.getNav()
  if (!res.locals.accountData) {
    req.flash("notice", "You must be logged in to access that page.");
    return res.redirect("/account/login");
  }

  const accountType = res.locals.accountData.account_type;
  if (res.locals.loggedin && accountType === "Admin") {
    res.render("account/admin", {
      title: "Administrate Accounts",
      nav,
      errors: null
    })
  } else {
    req.flash("error", "You do not have access to that page.");
    return res.redirect("/account/login");
  }
}

accController.buildDeleteConfirmation = async function(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  if (isNaN(account_id)) {
    console.error("Invalid account_id");
    return res.redirect("account/admin");
  }
    let nav = await utilities.getNav()
    const account = await accountModel.getAccountByAccountId(account_id)
    const accountName = `${account.account_firstname} ${account.account_lastname}`    
    res.render("account/admin-delete", {
          title: "Delete " + accountName,
          nav,
          errors: null,
          account_id: account.account_id,
          account_firstname: account.account_firstname,
          account_lastname: account.account_lastname,
          account_email: account.account_email,
          account_type: account.account_type
        })
      }
accController.buildAdminUpdate = async function(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountByAccountId(account_id)
  const accountName = `${accountData.account_firstname} ${accountData.account_lastname}`    
  res.render("account/admin-update", {
        title: "Edit " + accountName,
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      })
    }

accController.getAllAccounts = async (req,res,next) => {
  try {
    const accounts = await accountModel.getAllAccounts()
    res.json(accounts)
  } catch (err) {
    console.error("Error retrieving accounts:", err)
    res.status(500).json({ error: "Server error while fetching accounts" })
  }
}

accController.deleteAccount = async function(req, res) {
    let nav = await utilities.getNav()
    const account_id = req.body.account_id
    
    const deleteResult = await accountModel.deleteAccount(account_id)
    if (deleteResult) {
      req.flash("notice", `The account was successfully deleted.`)
      req.session.save(() => {
        res.redirect("/account/admin")
      })
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      req.session.save(() => {res.status(501).redirect(`/account/delete/${account_id}`)})
  }
}

accController.adminUpdateAccount = async function(req, res) {
      let nav = await utilities.getNav()
      const {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_type
      } = req.body
      const updateResult = await accountModel.adminUpdateAccount(account_id, account_firstname, account_lastname, account_email, account_type)
      if (updateResult) {
        const accountName = updateResult.account_firstname+ " " + updateResult.account_lastname
        req.flash("notice", `${accountName} was successfully updated.`)
        res.redirect("/account/admin")
      } else {
        const accountName = `${account_firstname} ${account_lastname}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("account/admin-update", {
        title: "Edit " + accountName,
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_type
        })
    }
  }

/* ****************************************
*  Deliver update view
* *************************************** */
accController.buildUpdate = async function(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}

accController.registerAccount = async function(req,res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

accController.updateAccount = async function(req,res) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const { 
    account_firstname, 
    account_lastname, 
    account_email } = req.body

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `${account_firstname}, your account details have been updated.`
    )
    res.status(201).render("./account/account-management", {
      title: "Manage Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  } else {
    req.flash("notice", "Sorry, the account update failed.")
    res.status(501).render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

accController.updatePassword = async function(req,res) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const { account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(500).render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (regResult) {
    req.flash(
      "notice",
      `Success! You have updated your password.`
    )
    res.status(201).render("./account/account-management", {
      title: "Manage Account",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("./account/update", {
      title: "Update Account",
      nav,
      errors: null
    })
  }
}

accController.logout = function(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/")
}

  module.exports = accController