module.exports = function(sequelize, DataTypes) {
	var QuizDescriptor =  sequelize.define('QuizDescriptor', {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		descriptor: DataTypes.JSONB
	}, {
		classMethods: {
			associate: function(models) {
				QuizDescriptor.belongsTo(models.User);
			}
		}
	});

	return QuizDescriptor;
};