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