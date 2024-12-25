const express = require('express');
const path = require('path');
const { createTask } = require('./models/task.model.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running`);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/tasks', async (req, res) => {
try {
    const task = await createTask(req.body);
    res.status(task.status).json({ message: task.message });
} catch (error) {
    res.status(500).json({ message:  error.message });
}
});
