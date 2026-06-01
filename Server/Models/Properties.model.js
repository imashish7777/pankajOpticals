const mongoose = require("mongoose");

var PropertiesSchema = mongoose.Schema({
  brands: {type:Array,lowerCase:true },
  colors: Array,
  shapes: Array,
  sizes: Array,
  categories: Array,
  frameTypes:Array,
  genders:Array,
});

module.exports = PropertiesModel = mongoose.model(
  "Properties",
  PropertiesSchema
);
