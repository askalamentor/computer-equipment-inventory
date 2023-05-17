const Location = require('../models/location');
const asyncHandler = require('express-async-handler');

// Display list of all Locations
exports.location_list = asyncHandler(async (req, res, next) => {
  const allLocation = await Location.find({}, 'name address inventory')
    .sort({ name: 1 })
    .exec();

  res.render('location/location_list', {
    title: 'Location List',
    location_list: allLocation,
  });
});

// Display detail page for a specific Location
exports.location_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Location detail: ${req.params.id}`);
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
