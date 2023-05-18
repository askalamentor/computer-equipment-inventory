const Inventory = require('../models/inventory');
const asyncHandler = require('express-async-handler');

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
  res.send('NOT IMPLEMENTED: Inventory create GET');
});

// Handle Inventory create on POST.
exports.inventory_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Inventory create POST');
});

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
