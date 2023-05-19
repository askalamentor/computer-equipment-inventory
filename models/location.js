const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create model
const LocationSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  address: { type: String, required: true, minLength: 3, maxLength: 200 },
  inventory: [Schema.Types.ObjectId, 'Inventory'],
});

// Virtual for location's URL
LocationSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/location/${this._id}`;
});

// Export model
module.exports = mongoose.model('Location', LocationSchema);
