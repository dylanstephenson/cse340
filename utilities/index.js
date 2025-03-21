const invModel = require("../models/inventory-model")
const Util = {}

/********************
 * Constructs the nav HTML unordered list
 ********************* */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name + 
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/**************************
 * Build the classification view HTML
 **************************/
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<div class="grid-card">'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_image 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"/></a>'
            grid += '<hr/>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}
Util.buildInventoryCard = async function(vehicle){
    let card = ''
    card += '<div id="vehicle-display">'
    card += '<h2 id="vehicle-header">' + vehicle.inv_year + ' ' + vehicle.inv_make 
    + ' ' + vehicle.inv_model + '</h2>'
    card += '<img src="' + vehicle.inv_image + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors" />'
    card +=  '<h3 id="details-subheader">'+ vehicle.inv_make + ' '+ vehicle.inv_model 
    + ' Details </h3>'
    card += '<ul id="vehicle-details">'
    card += '<li><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) +'</li>'
    card += '<li><strong>Description:</strong> ' + vehicle.inv_description + '</li>'
    card += '<li><strong>Color:</strong> ' + vehicle.inv_color + '</li>'
    card += '<li><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>'
    card += '</ul>'
    card += '</div>'
    return card
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util