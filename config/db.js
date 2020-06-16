const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
        .then((conn) => console.log(conn.connection.host))
        .catch((err) => {
            console.log(err)
            process.exit(1);
        });
}

module.exports = connectDB;