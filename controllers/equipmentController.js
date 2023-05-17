const asyncHandler = require('express-async-handler');

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
  res.send('NOT IMPLEMENTED: Equipment create GET');
});

// Handle Equipment create on POST.
exports.equipment_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Equipment create POST');
});

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
