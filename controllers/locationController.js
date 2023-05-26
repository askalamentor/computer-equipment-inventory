const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Location = require('../models/location');
const Inventory = require('../models/inventory');

// Display list of all Locations
exports.location_list = asyncHandler(async (req, res, next) => {
  const allLocation = await Location.find({})
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
  // Get details of locations and all their inventories (in parallel)
  const [location, allInventoriesByLocation] = await Promise.all([
    Location.findById(req.params.id).exec(),
    Inventory.find({ location: req.params.id }, 'equipment numberInStock')
      .populate('equipment')
      .exec(),
  ]);

  if (location === null) {
    // No results.
    res.redirect('/catalog/locations');
  }

  res.render('location/location_delete', {
    title: 'Delete Location',
    location: location,
    location_inventories: allInventoriesByLocation,
  });
});

// Handle Location delete on POST
exports.location_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of locations and all their inventories (in parallel)
  const [location, allInventoriesByLocation] = await Promise.all([
    Location.findById(req.params.id).exec(),
    Inventory.find({ location: req.params.id }, 'equipment numberInStock')
      .populate('equipment')
      .exec(),
  ]);

  if (allInventoriesByLocation.length > 0) {
    // Location has inventories. Render in same way as for GET route.
    res.render('location/location_delete', {
      title: 'Delete Location',
      location: location,
      location_inventories: allInventoriesByLocation,
    });
    return;
  } else {
    // Location has no inventories. Delete object and redirect to the list of locations.
    await Location.findByIdAndRemove(req.body.locationid);
    res.redirect('/catalog/locations');
  }
});

// Display Location update form on GET
exports.location_update_get = asyncHandler(async (req, res, next) => {
  // Get location.
  const location = await Location.findById(req.params.id).exec();

  if (location === null) {
    // No results
    const err = new Error('Location not found');
    err.status = 404;
    return next(err);
  }

  res.render('location/location_form', {
    title: 'Update Location',
    location: location,
  });
});

// Handle Location update on POST
exports.location_update_post = [
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

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Get location inventories
    const oldLocation = await Location.findById(req.params.id).exec();

    // Create a Location object with escaped/trimmed data and old id
    const location = new Location({
      name: req.body.name,
      address: req.body.address,
      inventory: oldLocation.inventory,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error message
      res.render('locatin/location_form', {
        title: 'Update Location',
        location: location,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the location
      const theLocation = await Location.findByIdAndUpdate(
        req.params.id,
        location,
        {}
      );

      // Redirect to location detail
      res.redirect(theLocation.url);
    }
  }),
];
