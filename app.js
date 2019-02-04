const express = require('express');
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '8196a2b6',
  apiSecret: 'xO4syW8tIdwG605H'
});

const options = [
  'Meh',
  'Good',
  'Great!'
];

let notification = "How was your experience? " + "type 1 , 2 or 3: \n\n";

options.forEach((option, index) => {
  notification += `${index+1}. for ${option}\n`;
});


// initialize express, the template directory, and form parsing
const app = express();
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }));

// a form for submitting phone numbers
app.get('/', (_, response) => {
  response.sendFile('index.html');
});

// notification endpoint
app.post('/notify', (request, response) => {
  send(request.body.number, notification);
  response.send('Notification sent');
});

app.get('/response', (request, response) => {
  // TODO: store this selection somewhere in your database

  // parse the message the user sent us
  const selection = parseInt(request.query.text) - 1;
  const day = options[selection];

  // by default we will warn them to send us a valid response
  let message = "Please select from one of the valid options only.";

  // if the response was valid though we confirm the selection
  if (day) {
    message = `Thank you! Your delivery has been rescheduled for ${day}`;
  }

  send(request.query.msisdn, message);
  response.send('Response processed');
});

let send = function(number, message) {
  nexmo.message.sendSms(
    '13862192630',
    number,
    message
  );
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => console.log(`Server started on ${ PORT }`));
