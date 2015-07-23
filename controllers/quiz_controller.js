var models = require('../models/models.js');


// GET /quizes/question


//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId)
{
	models.Quiz.find(quizId).then(
	function(quiz){
	if (quiz){
		req.quiz = quiz;
		next();
	} 
	else 
	{ 
		next(new Error('No existe quizId=' + quizId));}
	}).catch(function(error){next(error);});
};

// Versión sin BD
//exports.question = function (req,res){
//	res.render('quizes/question',{pregunta: 'Capital de Italia'});
//};

// Versión monorecurso
//exports.question = function(req,res){
//	models.Quiz.findAll().success(function(quiz){
//		res.render('quizes/question',{pregunta:quiz[0].pregunta})
//	})
//};

exports.show = function(req,res){
			res.render('quizes/show',{quiz: req.quiz});
	
};

// GET /quizes/answer
// Versión monorecurso
//exports.answer = function(req,res){
//	models.Quiz.findAll().success(function(quiz){
//		if (req.query.respuesta === quiz[0].respuesta){
//			res.render('quizes/answer',{ respuesta: 'Correcto'});
//		} else {
//			res.render('quizes/answer',{ respuesta: 'Incorrecto'});
//		}
//	})
//};

// Versión sin BD
//exports.answer = function(req,res){
//	if (req.query.respuesta ==='Roma')
//	{
//		res.render('quizes/answer',{respuesta: 'Correcto'});	
//	}
//	else
//	{
//		res.render('quizes/answer',{respuesta: 'Incorrecto'});	
//	}
//};

exports.answer = function(req,res){
	var resultado='Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado});
};


exports.index = function(req,res)
{
	var busqueda = req.query.search;
	
	if ( busqueda===undefined || busqueda === ''  )
	{
		// En el caso de que se pulse desde el menu de navegación o la
		// consulta esté vacia.
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		}).catch(function(error){next(error);})	
	}
	else
	{
		busqueda = '%' + busqueda + '%';
		busqueda = busqueda.replace(/ /g,'%');
		//En el caso que hay escrito algo en el buscador de preguntas
		console.log(busqueda);
		models.Quiz.findAll({where:['pregunta like ?',busqueda]}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		}).catch(function(error){next(error);})	
		
	}
};
		
	
