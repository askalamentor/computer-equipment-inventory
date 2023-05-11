const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create model
const InventorySchema = new Schema({
  equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 1000000 },
  location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
});

// Virtual for invertory's URL
InventorySchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/inventory/${this._id}`;
});

// Export model
module.exports = mongoose.model('Inventory', InventorySchema);
