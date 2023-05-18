const Location = require('../models/location');
const Inventory = require('../models/inventory');
const asyncHandler = require('express-async-handler');

// Display list of all Locations
exports.location_list = asyncHandler(async (req, res, next) => {
  const allLocation = await Location.find({}, 'name address inventory')
    .sort({ name: 1 })
    .populate('inventory')
    .exec();

  res.render('location/location_list', {
    title: 'Location List',
    location_list: allLocation,
  });
});

// Display detail page for a specific Location
exports.location_detail = asyncHandler(async (req, res, next) => {
  const [location, allInventoriesByLocation] = await Promise.all([
    Location.findById(req.params.id).exec(),
    Inventory.find({ location: req.params.id }).populate('equipment').exec(),
  ]);

  if (location === null) {
    // No results.
    const err = new Error('Location not found');
    err.status = 404;
    return next(err);
  }

  res.render('location/location_detail', {
    location: location,
    inventories: allInventoriesByLocation,
  });
});

// Display Location create form on GET.
exports.location_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Location create GET');
});

// Handle Location create on POST.
exports.location_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Location create POST');
});

// Display Location delete form on GET
exports.location_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Location delete GET');
});

// Handle Location delete on POST
exports.location_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Location delete POST');
});

// Display Location update form on GET
exports.location_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Location update GET');
});

// Handle Location update on POST
exports.location_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Location update POST');
});
