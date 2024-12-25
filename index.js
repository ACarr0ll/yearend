const express = require('express');
const { createTask } = require('./models/task.model.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! Testing');
});

app.post('/api/tasks', async (req, res) => {
try {
    const task = await createTask(req.body);
    res.status(task.status).json({ message: task.message });
} catch (error) {
    res.status(500).json({ message:  error.message });
}
});

app.listen(port, () => {
    console.log(`Server running`);
});