const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// router to pull up account login and registration page
router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get("/register", utilities.handleErrors(accController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement))
router.get("/update", utilities.handleErrors(accController.buildUpdate))
router.get("/logout", utilities.handleErrors(accController.logout))

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

router.post(
    '/update',
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accController.updateAccount)
)

router.post(
    '/password',
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accController.updatePassword)
)

module.exports = router;