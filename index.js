const express = require('express');
const { createTask } = require('./models/task.model.js');
const cors = require('cors');
const HttpsProxyAgent = require('https-proxy-agent');

const app = express();
app.use(cors());
app.use(express.json())

// Configure Proximo
if (process.env.PROXIMO_URL) {
    const proxyAgent = new HttpsProxyAgent(process.env.PROXIMO_URL);
    app.set('trust proxy', true);
    app.use((req, res, next) => {
        req.agent = proxyAgent;
        next();
    });
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running`);
});

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

app.listen(() => {
    console.log(`Server running`);
});