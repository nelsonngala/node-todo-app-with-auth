require('dotenv').config();

const express = require('express');

const app = express();
const fileUpload = require('express-fileupload');
const port = 5000;
const connectDb = require('./db/connect');
const authRoute = require('./routes/userRoutes');
const todoRoute = require('./routes/todoRouter');
const uploadRoute = require('./routes/uploadRouter');
const authMiddleware = require('./middleware/authentication');

app.use(express.static('./public'));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.get('/', (req, res) => {
    res.send('Home')
});

app.use('/api', authRoute);
app.use('/api', uploadRoute);
app.use('/api', authMiddleware, todoRoute);




const start = async () => {
    try {      
     await connectDb(process.env.MONGO_URI);  
     app.listen(port, () => {
        console.log(`server is listening at port ${port}...`);
    });
    } catch (error) {
        console.log(error);
    }
}

start();