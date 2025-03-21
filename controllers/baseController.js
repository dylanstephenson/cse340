const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.handleErrors = async function (err, req, res, next) {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message = err.status === 404 
      ? err.message 
      : "Oh no! There was a crash. Maybe try a different route?"
  res.status(err.status || 500).render("errors/error", {
      title: err.status || "Server Error",
      message,
      nav
  });
}

module.exports = baseController