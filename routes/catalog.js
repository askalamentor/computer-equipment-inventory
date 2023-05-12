const express = require('express');
const router = express.Router();

// Require controller modules.
const category_controller = require('../controllers/categoryController');
const equipment_controller = require('../controllers/equipmentController');
const inventory_controller = require('../controllers/inventoryController');
const location_controller = require('../controllers/locationController');

/// ----- EQUIPMENT ROUTES ----- ///

// GET catalog home page.
router.get('/', equipment_controller.index);

// GET request for CREATING a equipment. NOTE: This must come before routes that display equipment (uses id)
router.get('/equipment/create', equipment_controller.equipment_create_get);

// POST request for CREATING equipment
router.post('/equipment/create', equipment_controller.equipment_create_post);

// GET request to DELETE equipment
router.get('/equipment/:id/delete', equipment_controller.equipment_delete_get);

// POST request to DELETE equipment
router.post(
  '/equipment/:id/delete',
  equipment_controller.equipment_delete_post
);

// GET request to UPDATE equipment
router.get('/equipment/:id/update', equipment_controller.equipment_update_get);

// POST request to UPDATE equipment
router.post(
  '/equipment/:id/update',
  equipment_controller.equipment_update_post
);

// GET request for one equipment
router.get('/equipment/:id', equipment_controller.equipment_detail);

// GET request for list of all equipments
router.get('/equipments', equipment_controller.equipment_list);

/// ----- CATEGORY ROUTES ----- ///

// GET request for CREATING a category. NOTE: This must come before routes that display category (uses id)
router.get('/category/create', category_controller.category_create_get);

// POST request for CREATING category
router.post('/category/create', category_controller.category_create_post);

// GET request to DELETE category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to DELETE category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to UPDATE category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to UPDATE category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all categories
router.get('/categories', category_controller.category_list);

/// ---- INVENTORY ROUTES ----- ///

// GET request for CREATING a inventory. NOTE: This must come before routes that display inventory (uses id)
router.get('/inventory/create', inventory_controller.inventory_create_get);

// POST request for CREATING inventory
router.post('/inventory/create', inventory_controller.inventory_create_post);

// GET request to DELETE inventory
router.get('/inventory/:id/delete', inventory_controller.inventory_delete_get);

// POST request to DELETE inventory
router.post(
  '/inventory/:id/delete',
  inventory_controller.inventory_delete_post
);

// GET request to UPDATE inventory
router.get('/inventory/:id/update', inventory_controller.inventory_update_get);

// POST request to UPDATE inventory
router.post(
  '/inventory/:id/update',
  inventory_controller.inventory_update_post
);

// GET request for one inventory
router.get('/inventory/:id', inventory_controller.inventory_detail);

// GET request for list of all inventories
router.get('/inventories', inventory_controller.inventory_list);

/// ----- LOCATION ROUTES ----- ///

// GET request for CREATING a location. NOTE: This must come before routes that display location (uses id)
router.get('/location/create', location_controller.location_create_get);

// POST request for CREATING location
router.post('/location/create', location_controller.location_create_post);

// GET request to DELETE location
router.get('/location/:id/delete', location_controller.location_delete_get);

// POST request to DELETE location
router.post('/location/:id/delete', location_controller.location_delete_post);

// GET request to UPDATE location
router.get('/location/:id/update', location_controller.location_update_get);

// POST request to UPDATE location
router.post('/location/:id/update', location_controller.location_update_post);

// GET request for one location
router.get('/location/:id', location_controller.location_detail);

// GET request for list of all locations
router.get('/locations', location_controller.location_list);

module.exports = router;
