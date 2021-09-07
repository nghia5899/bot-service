let mongoose = require("mongoose");

let CoinSchema = new mongoose.Schema({
  Id: {type: Number, required:false, default: 0},
  Name: {type: String, required:false, default: ''},
  FullName: {type: String, required:false, default: ''},
  Internal: {type: String, required:false, default: ''},
  Algorithm: {type: String, required:false, default: ''},
  ProofType: {type: String, required:false, default: ''},
  Rating: {
    Weiss: {
      Rating: {type: String, required:false, default: ''},
      TechnologyAdoptionRating: {type: String, required:false, default: ''},
      MarketPerformanceRating: {type: String, required:false, default: ''}
    }
  },
  NetHashesPerSecond: {type: Number, required:false, default: 0},
  BlockNumber: {type: Number, required:false, default: 0},
  BlockTime: {type: Number, required:false, default: 0},
  BlockReward: {type: Number, required:false, default: 0},
  AssetLaunchDate: {type: String, required:false, default: ''},
  MaxSupply: {type: Number, required:false, default: 0},
  Type: {type: Number, required:false, default: 0},
  DocumentType: {type: String, required:false, default: ''}
}, {timestamps: true});

var Coin = mongoose.model("Coin", CoinSchema)
Coin.collection.createIndex({
  Id: 1
},
{unique: true}
)


module.exports = { Coin }
