const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Location = require('../models/location');
const Inventory = require('../models/inventory');

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
  res.render('location/location_form', {
    title: 'Create Location',
  });
});

// Handle Location create on POST.
exports.location_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters')
    .escape(),
  body('address', 'Address must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Address must e at least 3 characters')
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Location object with escaped and trimmed data.
    const location = new Location({
      name: req.body.name,
      address: req.body.address,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render('location/location_form', {
        title: 'Create Location',
        location: location,
        errors: errors.array(),
      });
    } else {
      // Data from valid is valid.
      await location.save();
      res.redirect(location.url);
    }
  }),
];

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
