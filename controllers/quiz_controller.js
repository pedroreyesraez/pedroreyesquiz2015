var models = require('../models/models.js');


// GET /quizes/question


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
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: quiz});
	})
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
	models.Quiz.find(req.params.quizId).then(function(quiz){
	if (req.query.respuesta === quiz.respuesta){
		res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Correcto'});
	} else {
		res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
};


exports.index = function(req,res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{quizes: quizes});
	})
};
