const Category = require('../models/category');
const Equipment = require('../models/equipment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategory = await Category.find({}).sort({ name: 1 }).exec();

  res.render('category/category_list', {
    title: 'Category List',
    category_list: allCategory,
  });
});

// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated equipment (in parallel)
  const [category, equipmentInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Equipment.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (category === null) {
    // No results
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category/category_detail', {
    title: 'Category Detail',
    category: category,
    category_equipments: equipmentInCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category/category_form', { title: 'Create Category' });
});

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Category must contain at least 3 characters')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 100 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category/category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if category with same name already exists.

      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();

      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        console.log('last step');
        await category.save();
        console.log('saved');
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of category and all related equipments (in parallel)
  const [category, allEquipmentsByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Equipment.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (category === null) {
    // No results
    res.redirect('/catalog/categories');
  }

  res.render('category/category_delete', {
    title: 'Delete Category',
    category: category,
    category_equipments: allEquipmentsByCategory,
  });
});

// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all related equipments (in parallel)
  const [category, allEquipmentsByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Equipment.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (allEquipmentsByCategory.length > 0) {
    // Category has equipments. Render in same was as for GET route.
    res.render('category/category_delete', {
      title: 'Delete Category',
      category: category,
      category_equipments: allEquipmentsByCategory,
    });
    return;
  } else {
    // Category has no equipments. Delete object and redirect to the list of categories.
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/catalog/categories');
  }
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update GET');
});

// Handle Category update on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update POST');
});
