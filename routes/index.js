var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_Controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',errors: [] });
});

router.get('/author', function(req, res) {
  res.render('author', { title: 'autor', errors: [] });
});


// Versión monorecurso
//router.get('/quizes/question',quizController.question);
//router.get('/quizes/answer',quizController.answer);

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentID

// Definición de rutas de sesión.
router.get('/login',						sessionController.new); 	// Formulario Login
router.post('/login',						sessionController.create); 	// Crear sesión
router.get('/logout',						sessionController.destroy);	// Destruir sesión


// Definición de rutas de /quizes
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',					sessionController.loginRequired,	quizController.new);
router.post('/quizes/create',				sessionController.loginRequired,	quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired,	quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired,	quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired,	quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',	sessionController.loginRequired, commentController.publish);  // Deberiar de ser PUT para el cumplir con el interfaz REST

// Definición de rutas de estadísticas
router.get('/quizes/statistics',			sessionController.loginRequired,	statisticsController.view);


module.exports = router;
