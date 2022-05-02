const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const moment = require('moment');
const { Apps } = require('./models');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    // context: authMiddleware 
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

const getAllApps = async () => {
  const currentDate = moment().format('MM DD YYYY');
  const appsToday = await Apps.find({ date: currentDate });
  //console.log(appsToday.length)
  return appsToday;
};

const createMessage = (count, applications) => {
  if(count > 0) {
    let theString = `You had ${count} uses of the resume builder today. \n Your applicants are: \n`
    for(a in applications) {
      theString = theString.concat(`name: ${applications[a].name} email: ${applications[a].email} \n`)
    }
    return theString
  } else return 'You did not have any to uses of the resume builder today.'
}

const sendUpdate =  async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  let appsToEmail = await getAllApps();
  let count = appsToEmail.length;
  let message = createMessage(count,appsToEmail)
  transporter.sendMail({
    from: '"YES Resume Builder" <yesresumebuilder@gmail.com>', // sender address
    to: "riley_smith8@hotmail.com", // list of receivers
    subject: "Resume update", // Subject line
    //text: message, // plain text body
    html: message, // html body
  }).catch(console.error);
}

const keepTime = () => {
  setInterval(function() {
    let currentTime = moment().format('LT');
    if(currentTime === '11:58 PM') {
      sendUpdate();
    }
  }, 60000)
}
keepTime();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

//when ready to add authentication follow module 21.2.4