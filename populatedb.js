#! /usr/bin/env node

console.log(
  'This script populates some test equipment, category, location, and inventory to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/computer-equipment-inventory?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const e = require('express');
const Category = require('./models/category');
const Equipment = require('./models/equipment');
const Inventory = require('./models/inventory');
const Location = require('./models/location');

const categories = [];
const equipments = [];
const inventories = [];
const locations = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createEquipments();
  await createLocations();
  await createInventories();

  // get locations from the database
  const generatedLocations = await Location.find({}).exec();

  for (const location of generatedLocations) {
    const inventories = await Inventory.find({ location: location._id });
    location.inventory = inventories.map((inventory) => inventory._id);
    await location.save();
  }

  /*  // get inventories from the database
  const generatedInventories = await Inventory.find({}).exec();
  // add inventories to locations
  await Location.insertMany(
    generatedLocations.map((location) => ({
      ...location,
      inventory: generatedInventories.find(
        (inventory) => inventory.location === location._id
      )?._id,
    }))
  ); */

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function categoryCreate(name) {
  const category = new Category({ name: name });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function equipmentCreate(name, description, price, category) {
  equipmentdetail = { name: name, description: description, price: price };
  if (category != false) equipmentdetail.category = category;

  const equipment = new Equipment(equipmentdetail);

  await equipment.save();
  equipments.push(equipment);
  console.log(`Added equipment: ${name} ${description} ${price}`);
}

async function inventoryCreate(equipment, numberInStock, location) {
  inventorydetail = { numberInStock: numberInStock };
  if (equipment != false) inventorydetail.equipment = equipment;
  if (location != false) inventorydetail.location = location;

  const inventory = new Inventory(inventorydetail);
  await inventory.save();
  inventories.push(inventory);
  console.log(`Added inventory: ${numberInStock}`);
}

async function locationCreate(name, address, inventory) {
  locationdetail = { name: name, address: address };
  if (inventory != false) locationdetail.inventory = inventory;

  const location = new Location(locationdetail);
  await location.save();
  locations.push(location);
  console.log(`Added location: ${name} ${address}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate('Tshirt'),
    categoryCreate('Shoes'),
    categoryCreate('Bag'),
  ]);
}

async function createEquipments() {
  console.log('Adding equipments');
  await Promise.all([
    equipmentCreate('Nike Tshirt', 'White casual tshirt', 50, categories[0]),
    equipmentCreate(
      'Air Jordan Basketball Shoes',
      '1988 model, old-school, white and red colored Air Jordan',
      150,
      categories[1]
    ),
    equipmentCreate(
      'Adidas Football Shoes',
      'Shiny blue colored, special serie of Adidas World Cup Models',
      100,
      categories[1]
    ),
    equipmentCreate(
      'Casual Laptop Bag',
      'Orange casual laptop bag. It is suitable up to 17 inch laptops',
      35,
      categories[2]
    ),
    equipmentCreate(
      'Sport bag',
      'It is a waterproof sport bag. It is very nice!',
      85,
      categories[2]
    ),
  ]);
}

async function createInventories() {
  console.log('Adding inventories');
  await Promise.all([
    inventoryCreate(equipments[0], 50, locations[0]),
    inventoryCreate(equipments[1], 20, locations[0]),
    inventoryCreate(equipments[1], 10, locations[1]),
    inventoryCreate(equipments[2], 5, locations[2]),
  ]);
}

async function createLocations() {
  console.log('Adding locations');
  await Promise.all([
    locationCreate('London Store', 'Example Street, 1231, London', []),
    locationCreate('Istanbul Store', 'Example Street, 3456, London', []),
    locationCreate('LA Store', 'Example Street, 7855, London', []),
    locationCreate('New York Store', 'Example Street, 2134, London', []),
    locationCreate('Paris Store', 'Example Street, 7324, London', []),
    locationCreate('Amsterdam Store', 'Example Street, 7823, London', []),
    locationCreate('Sydney Store', 'Example Street, 5653, London', []),
  ]);
}
