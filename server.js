const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.error(`Error name: ${err.name}\nReason: ${err.message}`);
  console.log('Uncaught exception 💥\nShutting down...');
  process.exit(1);
});

const app = require('./app');

//hosted DB
const db = process.env.MONGO_DB_URL.replace(
  '<db_password>',
  process.env.MONGO_DB_PASS
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Database successfully conected...'));

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Error name: ${err.name}\nReason: ${err.message}`);
  console.log('Unhandled rejection! 💥\nShutting down...');
  server.close(() => {
    process.exit(1);
  });
});
