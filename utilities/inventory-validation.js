const { body, validationResult } = require("express-validator");

/* ***************************
 *  Inventory Data Validation Rules
 * ************************** */
const newInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters long."),
    
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters long."),
    
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1886, max: new Date().getFullYear() })
      .withMessage(`Year must be between 1886 and ${new Date().getFullYear()}.`),
    
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative number."),
    
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Classification ID is required.")
      .isInt()
      .withMessage("Classification ID must be a valid number."),
  ];
};

/* ***************************
 *  Check Inventory Data Middleware
 * ************************** */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("./index").getNav();
    const classificationSelect = await require("../models/inventory-model").buildClassificationList(req.body.classification_id);
    
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    });
    return;
  }
  next();
};

/* ***************************
 *  Check Update Inventory Data Middleware
 * ************************** */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("./index").getNav();
    const classificationSelect = await require("../models/inventory-model").buildClassificationList(req.body.classification_id);
    
    res.render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    });
    return;
  }
  next();
};

module.exports = {
  newInventoryRules,
  checkInventoryData,
  checkUpdateData,
};
