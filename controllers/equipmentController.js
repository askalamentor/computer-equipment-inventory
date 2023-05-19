const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Equipment = require('../models/equipment');
const Inventory = require('../models/inventory');
const Location = require('../models/location');

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of categories, equipments, inventories and locations counts (in parallel)
  const [numCategory, numEquipment, numInventory, numLocation] =
    await Promise.all([
      Category.countDocuments({}).exec(),
      Equipment.countDocuments({}).exec(),
      Inventory.countDocuments({}).exec(),
      Location.countDocuments({}).exec(),
    ]);

  res.render('index', {
    title: 'Computer Equipment Inventory Home',
    category_counts: numCategory,
    equipment_counts: numEquipment,
    inventory_counts: numInventory,
    location_counts: numLocation,
  });
});

// Display list of all Equipments
exports.equipment_list = asyncHandler(async (req, res, next) => {
  const allEquipment = await Equipment.find({}, 'name description price')
    .sort({ name: 1 })
    .populate('description')
    .exec();

  res.render('equipment/equipment_list', {
    title: 'Equipment List',
    equipment_list: allEquipment,
  });
});

// Display detail page for a specific Equipment
exports.equipment_detail = asyncHandler(async (req, res, next) => {
  // Get details of equipment
  const equipment = await Equipment.findById(req.params.id)
    .populate('category')
    .exec();

  if (equipment === null) {
    // No results.
    const err = new Error('Equipment not found');
    err.status = 404;
    return next(err);
  }

  res.render('equipment/equipment_detail', {
    equipment: equipment,
  });
});

// Display Equipment create form on GET.
exports.equipment_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();

  res.render('equipment/equipment_form', {
    title: 'Create Equipment',
    categories: categories,
  });
});

// Handle Equipment create on POST.
exports.equipment_create_post = [
  // Convert the category to an array
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Equipment name must be at least have 3 characters')
    .isLength({ max: 100 })
    .withMessage('Equipment name must not exceed 100 characters')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must be at least have 3 characters')
    .isLength({ max: 300 })
    .withMessage('Description must not exceed 300 characters')
    .escape(),
  body('price')
    .trim()
    .isFloat({ min: 0 })
    .withMessage('Price must be at least 0')
    .isFloat({ max: 1000000 })
    .withMessage('Price must not exceed 1000000')
    .escape(),
  body('category.*').escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Equipment object with escaped and trimmed data.
    const equipment = Equipment({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories
      const categories = await Category.find().exec();

      // Mark our selected categories
      for (const category in categories) {
        if (equipment.category.indexOf(category._id) > -1) {
          category.checked = 'true';
        }
      }
      res.render('equipment/equipment_form', {
        title: 'Create Equipment',
        categories: categories,
        equipment: equipment,
        errors: errors.array(),
      });
    } else {
      // Date from form is valid.
      await equipment.save();
      res.redirect(equipment.url);
    }
  }),
];

// Display Equipment delete form on GET
exports.equipment_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Equipment delete GET');
});

// Handle Equipment delete on POST
exports.equipment_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Equipment delete POST');
});

// Display Equipment update form on GET
exports.equipment_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Equipment update GET');
});

// Handle Equipment update on POST
exports.equipment_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Equipment update POST');
});
