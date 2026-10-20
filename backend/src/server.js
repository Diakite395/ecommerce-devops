const createApp = require('./app');
const pool = require('./db');

const PORT = process.env.PORT || 3000;
const app = createApp(pool);

app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
