const mongoose = require('mongoose');

const connectDB = async () => {
await mongoose.connect('mongodb+srv://alziyan:alziyan@cluster0.vrzk8.mongodb.net/?appName=Cluster0/tinder');
};




module.exports = connectDB;