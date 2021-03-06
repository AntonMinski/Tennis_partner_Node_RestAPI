const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/tennis_partner_node";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
}

module.exports = connectDB;

