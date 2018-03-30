const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//Puerto que Heroku decide usar
const port = process.env.PORT || 3000;

//Declarar objeto
var app = express();

// Registrar carpeta donde se almacena 'Base' html
hbs.registerPartials(__dirname + '/views/partials');

// Definir el tipo de templating que se utilizara
app.set('view engine', 'hbs');

//Middleware

//Loggear
app.use( (req, res, next) => {
  var now = new Date().toString();

  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);

  //Agregar a archivo
  fs.appendFile('server.log', log + '\n', (error) => {
    if(error) {
      console.log('Unable to append to server.log');
    }
  });

  //Continuar
  next();
});

//Modo de mantenimiento
// app.use( (req, res, next) => {
//   res.render('maintenance.hbs');
// });

//Definir directorio de assets estaticos
app.use(express.static(__dirname + '/public'));

//Helpers para templating

//Funcion que retorna el año actual
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

//Funcion que convierte un string a mayusculas
hbs.registerHelper('toUpperCase', (text) => {
  return text.toUpperCase();
});

//Routing

//Root
app.get('/', (req, res) => {

  //Mostrar HTML y pasar variables
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my site!'
  });

});

//About
app.get('/about', (req, res) => {

  //Mostrar HTML y pasar variables
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });

});

//Bad
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fullfill request.'
  });
});

//Inicializar
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
