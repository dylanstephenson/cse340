const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// router to pull up account login and registration page
router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get("/register", utilities.handleErrors(accController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement))

// send registration information
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount))

router.post(
    "/login",
    regValidate.LoginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
    )

module.exports = router;