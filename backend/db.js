const mongoose = require("mongoose");

async function connectToMongo() {
    await mongoose.connect("mongodb://127.0.0.1:27017/noteDB").then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
  }

module.exports = connectToMongo;