const express = require('express');
const baseController = require('../controllers/baseController');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));
router.get("/trigger-error", (req, res, next) => {
    const error = new Error("Oh no! There was a crash. Maybe try a different route?")
    error.status = 500;
    next(error);
});

router.use(baseController.handleErrors);

module.exports = router;



