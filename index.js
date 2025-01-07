const express = require('express');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { createTask } = require('./models/task.model.js');
const { createUser, loginUser } = require('./models/user.model.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure session management
app.use(session({
    store: new SQLiteStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running`);
});

app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/submissions', (req, res) => {
    if (req.session.user) {
        res.render('submissions', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
});

app.get('/createUser', (req, res) => {
    res.render('createUser', { user: req.session.user });
});

app.post('/api/tasks', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const task = await createTask(req.body);
        res.status(task.status).json({ message: task.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(user.status).json({ message: user.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await loginUser(req.body);
        if (user.status === 200) {
            req.session.user = req.body.username;
        }
        res.status(user.status).json({ message: user.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.redirect('/login');
    });
});