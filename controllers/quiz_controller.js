var models = require('../models/models.js');
var temas = ["otro","humanidades","ocio","Ciencia","Tecnología"];

// GET /quizes/question


//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId)
{
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{ model: models.Comment}]}
	).then(function(quiz){
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
			res.render('quizes/show',{quiz: req.quiz,errors: []});
	
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
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado,errors: []});
};


exports.index = function(req,res)
{
	var busqueda = req.query.search;
	
	if ( busqueda===undefined || busqueda === ''  )
	{
		// En el caso de que se pulse desde el menu de navegación o la
		// consulta esté vacia.
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes,errors: []});
		}).catch(function(error){next(error);})	
	}
	else
	{
		busqueda = '%' + busqueda + '%';
		busqueda = busqueda.replace(/( )+/g,'%');
		//En el caso que hay escrito algo en el buscador de preguntas
		console.log(busqueda);
		models.Quiz.findAll({where:['pregunta like ?',busqueda]}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes,errors: []});
		}).catch(function(error){next(error);})	
		
	}
};

//GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(// crea objeto quiz
		{pregunta:"Pregunta",respuesta:"Respuesta", temas: temas}
	);
	res.render('quizes/new',{quiz:quiz,temas: temas, errors:[]});
};

//POST /quizes/create
exports.create = function(req,res){
	var quiz= models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new',{quiz: quiz, temas:temas, errors: err.errors});
			}else{
				// Guarda en DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields: ["pregunta","respuesta","tema"]})
				.then( function(){res.redirect('/quizes')}) 
					// Redireccion HTTP (URL relativo) lista de preguntas	
			}
		}
	);
}; 

// GET /quizes :id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, temas:temas, errors: []});
};

// PUT '/quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta= req.body.quiz.respuesta;
	req.quiz.tema     = req.body.quiz.tema;

	req.quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else{
				req.quiz		// save: guarda campos pregunta y respuesta en BD.
				.save( {fields: ["pregunta","respuesta","tema"]})
				.then(	function() {res.redirect('/quizes');});
						// Redirección HTTP a la lista de preguntas (URL relativo)
			}
		}
	);
};

// DELETE /quizes/ :id

exports.destroy = function (req,res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};


		
	
