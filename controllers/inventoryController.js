const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
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
      // Save updated location
      const existedLocation = await Location.findById(
        inventory.location._id
      ).exec();
      existedLocation.inventory.push(inventory);

      await existedLocation.save();

      await inventory.save();
      res.redirect(inventory.url);
    }
  }),
];

// Display Inventory delete form on GET
exports.inventory_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of inventory
  const inventory = await Inventory.findById(req.params.id).exec();

  if (inventory === null) {
    // No results.
    res.redirect('/catalog/inventories');
  }

  res.render('inventory/inventory_delete', {
    title: 'Delete Inventory',
    inventory: inventory,
  });
});

// Handle Inventory delete on POST
exports.inventory_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of inventories.
  await Inventory.findByIdAndRemove(req.body.inventoryid);

  // Remove inventory from location
  // Get location details.
  const location = await Location.find(
    { inventory: req.params.id },
    'inventory'
  ).exec();

  // location.inventory array => [new ObjectId("id1"), new ObjectId("id2"), ...]
  // So, we need to create new ObjectId
  const inventoryIdToRemove = new mongoose.Types.ObjectId(
    `${req.body.inventoryid}`
  );

  // Get location's inventory field.
  // Inventory field => [{_id, inventory: []}], reason of location[0S]
  const inventory = location[0].inventory;

  // Get index of deleted inventory
  const inventoryIndex = inventory.findIndex((id) =>
    id.equals(inventoryIdToRemove)
  );

  if (inventoryIndex === -1) {
    // Deleted inventory does not exist in location's inventory field.
    const error = new Error('Not found inventory.');
    error.status = 400;
    return next(error);
  } else {
    // Remove deleted inventory from location's inventory field and save.
    location[0].inventory.splice(inventoryIndex, 1);
    await location[0].save();
  }

  res.redirect('/catalog/inventories');
});

// Display Inventory update form on GET
exports.inventory_update_get = asyncHandler(async (req, res, next) => {
  // Get inventory, equipments, and locations.
  const [inventory, allEquipments, allLocations] = await Promise.all([
    Inventory.findById(req.params.id)
      .populate('equipment')
      .populate('location')
      .exec(),
    Equipment.find().exec(),
    Location.find().exec(),
  ]);

  if (inventory === null) {
    // No results.
    const err = new Error('Inventory not found');
    err.status = 404;
    return next(err);
  }

  // Mark our selected equipment and location as checked.
  for (const equipment of allEquipments) {
    if (equipment._id.toString() === inventory.equipment._id.toString()) {
      equipment.checked = 'true';
    }
  }

  for (const location of allLocations) {
    if (location._id.toString() === inventory.location._id.toString()) {
      location.checked = 'true';
    }
  }

  // Render inventory form
  res.render('inventory/inventory_form', {
    title: 'Update Inventory',
    inventory: inventory,
    equipments: allEquipments,
    locations: allLocations,
  });
});

// Handle Inventory update on POST
exports.inventory_update_post = [
  // Convert equipments and locations to an array (seperate)
  (req, res, next) => {
    if (!(req.body.equipment instanceof Array)) {
      if (typeof req.body.equipment === 'undefined') {
        req.body.equipment = [];
      } else {
        req.body.equipment = new Array(req.body.equipment);
      }
    }

    if (!(req.body.location instanceof Array)) {
      if (typeof req.body.location === 'undefined') {
        req.body.location = [];
      } else {
        req.body.location = new Array(req.body.location);
      }
    }
    next();
  },

  // Validate and sanitize fields
  body('numberInStock', 'Number in stock must not be empty.')
    .trim()
    .isInt(0)
    .withMessage('Number in stock must be at least 0')
    .isInt(1000000)
    .withMessage('Number in stock must not exceed 1000000')
    .escape(),
  body('equipment.*').escape(),
  body('location.*').escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Inventory object with escaped/trimmed data and old id
    const inventory = new Inventory({
      equipment:
        typeof req.body.equipment === 'undefined' ? [] : req.body.equipment,
      numberInStock: req.body.numberInStock,
      location:
        typeof req.body.location === 'undefined' ? [] : req.body.location,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages

      // Get all equipments and locations.
      const [allEquipments, allLocations] = await Promise.all([
        Equipment.find().exec(),
        Location.find().exec(),
      ]);

      // Mark our selected equipment and location as checked
      for (const equipment of allEquipments) {
        if (inventory.equipment.indexOf(equipment._id) > -1) {
          equipment.checked = 'true';
        }
      }

      for (const location of allLocations) {
        if (inventory.location.indexOf(location._id) > -1) {
          location.checked = 'true';
        }
      }

      // Render form
      res.render('inventory/inventory_form', {
        title: 'Update Inventory',
        inventory: inventory,
        equipments: allEquipments,
        locations: allLocations,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the inventory.
      const theInventory = await Inventory.findByIdAndUpdate(
        req.params.id,
        inventory,
        {}
      );

      // Redirect to inventory detail page
      res.redirect(theInventory.url);
    }
  }),
];
