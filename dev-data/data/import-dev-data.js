const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const db = process.env.MONGO_DB_URL.replace(
  '<db_password>',
  process.env.MONGO_DB_PASS
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() =>
    console.log('Mongo successfully conected in the import-dev-data.js')
  );

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importDataToTheDatabase = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

//Delete all data

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfuly deleted');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importDataToTheDatabase();
}

if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
