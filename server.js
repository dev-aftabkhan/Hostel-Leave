require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '172.16.40.17', () => {
  console.log(`Server running on http://172.16.40.17:${PORT}`);
});