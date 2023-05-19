const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create model
const EquipmentSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  description: { type: String, required: true, minLength: 3, maxLength: 300 },
  price: { type: Number, required: true, min: 0, max: 1000000 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

// Virtual for equipment's URL
EquipmentSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/equipment/${this._id}`;
});

// Export model
module.exports = mongoose.model('Equipment', EquipmentSchema);
