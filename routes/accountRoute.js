const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// router to pull up account login and registration page
router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get("/register", utilities.handleErrors(accController.buildRegister))

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
    (req, res) => {
        res.status(200).send('login process')
    }
    )

module.exports = router;