// Definición del modelo de çComment con validación

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{ texto: { type: DataTypes.STRING,
				   validate: {notEmpty: {msg: "-> Fatla comentario"}}
				}
		}
	);
}
