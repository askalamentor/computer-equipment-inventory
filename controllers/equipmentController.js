const Equipment = require('../models/equipment');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  res.send('NOTE IMPLEMENTED: Site Home Page');
});

// Display list of all Equipments
exports.equipment_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Equipment list');
});

// Display detail page for a specific Equipment
exports.equipment_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Equipment detail: ${req.params.id}`);
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
