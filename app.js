var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(partials());

// MW de autodexconexión
app.use(function(req,res,next) {
	console.log('MW control de tiempo en sesion');
	if (req.session.user) { // Comprobamos si estamos en una sesión
		if (!req.session.marcatiempo){ // Primera vez que se pone la marca de tiempo
			req.session.marcatiempo=(new Date()).getTime();

		} else {
			if ((new Date()).getTime() - req.session.marcatiempo > 12000) {
				delete req.session.user;
				delete req.session.marcatiempo;
				req.session.expirado=true; // Inidico que ha expirado la sesión para la próxima visualización
										   // que se ha de encargar de borrar la sesión para que vuelva a salir el mensaje.
			
			} else{
				// Actualizamos el último acceso.
				req.session.marcatiempo=(new Date()).getTime();
			}
		}
	}
	next();
});

//Helpers dinámicos:
app.use(function(req,res,next){
	// guardar path en session.redir para despues del login

	if(!req.path.match(/\/login|\/logout/)){
		req.session.redir = req.path;
	}

	//Hacer visible req.session en las vistas.
	res.locals.session = req.session;
	next();
});

app.use('/', routes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
			errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		errors: []
    });
});









module.exports = app;
