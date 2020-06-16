const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

//load env 
dotenv.config({ path: './config/config.env' });

const app = express();

connectDB();

//body parser
app.use(express.json());
app.use(cookieParser())


//Dev logger middleware
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

//file upload
app.use(fileUpload());

//import route
const bootcamps = require('./routes/bootcamp');
const courses = require('./routes/course');
const auth = require('./routes/auth');
const user = require('./routes/user');
const review = require('./routes/review');


//use route
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users',user);
app.use('/api/v1/reviews',review);


//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT,
    () => console.log(`Running in ${process.env.NODE_ENV} mode, listening to port ${PORT}`));