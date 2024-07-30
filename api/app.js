const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth-routes');
const refreshRoutes = require('./routes/refresh-routes');
const postsRoutes = require('./routes/posts-routes');
const usersRoutes = require('./routes/users-routes');
const storyRoutes = require('./routes/story-routes');

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, withCredentials');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    next();
});

app.get("/test", (req, res) => {
  res.send("Hello from the server!");
});
app.use('/auth', authRoutes);
app.use('/refresh', refreshRoutes);
app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
app.use('/stories', storyRoutes);

app.use((req, res, next) => {
    const error = new Error('Could not find this route.');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.status || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

// MONGOOSE SETUP
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(process.env.PORT,()=>console.log(`Listening on port ${process.env.PORT}`));
}).catch((error)=>console.log(`${error} did not connect`));
