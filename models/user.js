let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  name: {type: String, required:false, default: ''},
  password: {type: String, required:false, default: ''},
}, {timestamps: true})

var User = mongoose.model("User", UserSchema)
User.collection.createIndex({
  name: 1
},
  {unique: true}
)

module.exports = { User }
