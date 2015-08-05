var models = require ('../models/models.js'); 
var Sequelize = require('sequelize');



exports.view = function (req,res)
{
	var statistics = {	n_preguntas : '0',
						n_comentarios : '0',
						promedio_comentarios : 'Pendiente',
						preguntas_sin_comentarios : 'Ninguna',
						preguntas_con_comentarios : 'Ninguna',
						comentarios_no_publicados : 'Ninguna'
					};

	 models.Quiz.count().success(function(count) {
			// Número de preguntas
			statistics.n_preguntas = count;
			models.Comment.count().success(function(count){
				// Número de comentarios
				statistics.n_comentarios = count;
				// Promedio de comentarios
				statistics.promedio_comentarios = (statistics.n_comentarios / statistics.n_preguntas).toFixed(2);
				models.Comment.count({where: {publicado:false}}).success(function(count){
					// Comentarios no publicados
					statistics.comentarios_no_publicados = count;
					models.Quiz.count({distinct: true, include:[{model:models.Comment,where:{id: Sequelize.col('Comments.id')}}]}).success(function(count){
						//Preguntas con comentarios
						statistics.preguntas_con_comentarios=count;
						//Preguntas sin comentarios
						statistics.preguntas_sin_comentarios=statistics.n_preguntas - count

						// Renderizo una vez realizadas todas las consultas.
						res.render('statistics/estadisticas.ejs',{statistics: statistics, errors: []});
	
					});	
				});
			});
		});

};
