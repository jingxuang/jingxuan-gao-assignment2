const express = require('express');
const app = express();

const cors = require('cors');
const path = require('path');
const config = require('./server/config');
const session = require('express-session');

const userRouter = require('./server/routes/userRouter');
const postRouter = require('./server/routes/postRouter');

const mongoose = require('mongoose');

app.use(express.static(path.join(__dirname, 'build')));

// Configure Cors
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// configure and connect MongoDB server 

const url = config.mongoUrl;
mongoose.set('useFindAndModify', false);
const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

connect.then((db) => {
    console.log('Connected to mongodb server ~ ');
}, (err) => {
    console.log(err);
})

// Initialize the passport
const passport = require('passport');


app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routers 
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// error handler
// app.use(function(err, req, res, next) {
//         console.error(err.stack);
//         res.status(err.status || 500).send(err.message || 'Error!');
// });

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
});