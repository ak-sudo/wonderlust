const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const mongoURL = 'mongodb://127.0.0.1:27017/wonderlust';

async function main() {
    await mongoose.connect(mongoURL)
}

main().then(() => {
    console.log('MongoDB connected')
}).catch(err => {
    console.error(err)
})

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "680f9a392c6bc1c7a7c076a1"}));
   await Listing.insertMany(initData.data);
   console.log('Data initialized');
}

initDB()