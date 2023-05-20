const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Inventory = require('../models/inventory');
const Equipment = require('../models/equipment');
const Location = require('../models/location');

// Display list of all Inventories
exports.inventory_list = asyncHandler(async (req, res, next) => {
  const allInventory = await Inventory.find(
    {},
    'equipment numberInStock location'
  )
    .populate('equipment location')
    .exec();

  res.render('inventory/inventory_list', {
    title: 'Inventory List',
    inventory_list: allInventory,
  });
});

// Display detail page for a specific Inventory
exports.inventory_detail = asyncHandler(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate('equipment location')
    .exec();

  if (inventory === null) {
    // No results.
    const err = new Error('Inventory not found');
    err.status = 404;
    return next(err);
  }

  res.render('inventory/inventory_detail', {
    inventory: inventory,
  });
});

// Display Inventory create form on GET.
exports.inventory_create_get = asyncHandler(async (req, res, next) => {
  const [allEquipments, allLocations] = await Promise.all([
    Equipment.find().exec(),
    Location.find().exec(),
  ]);

  res.render('inventory/inventory_form', {
    title: 'Create Inventory',
    equipments: allEquipments,
    locations: allLocations,
  });
});

// Handle Inventory create on POST.
exports.inventory_create_post = [
  // Convert the equipment to an array
  (req, res, next) => {
    if (!(req.body.equipment instanceof Array)) {
      if (typeof req.body.equipment === 'undefined') req.body.equipment = [];
      else req.body.equipment = new Array(req.body.equipment);
    }
    next();
  },

  // Convert the location to an array
  (req, res, next) => {
    if (!(req.body.location instanceof Array)) {
      if (typeof req.body.location === 'undefined') req.body.location = [];
      else req.body.location = new Array(req.body.location);
    }
    next();
  },

  // Validate and sanitize fields.
  body('numberInStock', 'Number in stock must not be empty.')
    .trim()
    .isInt(0)
    .withMessage('Number in stock must be at least 0')
    .isInt(1000000)
    .withMessage('Number in stock must not exceed 1000000')
    .escape(),
  body('equipment.*').escape(),
  body('location.*').escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Inventory object with escaped and trimmed data.
    const inventory = new Inventory({
      equipment: req.body.equipment,
      numberInStock: req.body.numberInStock,
      location: req.body.location,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all equipments and locations for form
      const [allEquipments, allLocations] = await Promise.all([
        Equipment.find().exec(),
        Location.find().exec(),
      ]);

      // Choose our selected equipment and location
      for (const equipment in allEquipments) {
        if (inventory.equipment.indexOf(equipment._id) > -1) {
          equipment.selected = 'true';
        }
      }

      for (const location in allLocations) {
        if (inventory.location.indexOf(location._id) > -1) {
          location.selected = 'true';
        }
      }

      res.render('inventory/inventory_form', {
        title: 'Create Inventory',
        equipments: allEquipments,
        locations: allLocations,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      await inventory.save();
      res.redirect(inventory.url);
    }
  }),
];

// Display Inventory delete form on GET
exports.inventory_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Inventory delete GET');
});

// Handle Inventory delete on POST
exports.inventory_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Inventory delete POST');
});

// Display Inventory update form on GET
exports.inventory_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Inventory update GET');
});

// Handle Inventory update on POST
exports.inventory_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Inventory update POST');
});
