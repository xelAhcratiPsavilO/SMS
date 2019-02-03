import express from 'express';
import parser from 'body-parser';
import Nexmo from 'nexmo';
import dotenv from 'dotenv';

dotenv.config();

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
app.use(parser.urlencoded({ extended: false }));

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
  // TODO: Confirm selection
  response.send('Response processed');
});

let send = function(number, message) {
  nexmo.message.sendSms(
    '13862192630',
    number,
    message
  );
}

// start the server
app.listen(3000);
