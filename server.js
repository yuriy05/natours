const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

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

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
