'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const path = require("path")
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

// ensure database exists when server starts
const db = require("./database/db")
const create = async () => {
  try {
    await db.createDb();
  } catch (error) {
    console.log(error)
  }
}
create();

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

// point to react build folder
app.use(express.static(path.join(__dirname,'client', 'build')));

// redirect to build folder for azure deployment as Azure errors when running "npm install" for create-react-apps
/* not sure this is working how i expected
if(process.env.NODE_ENV === 'production') {
  app.get('/*', function (req, res) {
   	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} 
*/
  //Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });


app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        let error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
