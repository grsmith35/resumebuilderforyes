const faker = require('faker');

const db = require('../config/connection');
const { User, Apps } = require('../models');

db.once('open', async () => {

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const date = '04 30 2022';

    userData.push({ username, email, date });
  }

  const createdUsers = await Apps.collection.insertMany(userData);


  console.log('all done!');
  process.exit(0);
});
