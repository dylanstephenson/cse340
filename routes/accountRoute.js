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
router.get("/admin", utilities.handleErrors(accController.buildAdmin))
router.get("/getAccounts", utilities.handleErrors(accController.getAllAccounts))
router.get("/delete/:account_id", utilities.handleErrors(accController.buildDeleteConfirmation))
router.get("/admin-update/:account_id", utilities.handleErrors(accController.buildAdminUpdate))


router.post("/delete", utilities.handleErrors(accController.deleteAccount))
// send registration information
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount))

router.post(
    '/login',
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

router.post(
    '/admin-update',
    regValidate.updateAccountRules(),
    regValidate.checkAdminUpdateData,
    utilities.handleErrors(accController.adminUpdateAccount)
)

module.exports = router;