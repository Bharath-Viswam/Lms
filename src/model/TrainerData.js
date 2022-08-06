const mongoose = require('mongoose');
mongoose
	.connect(
		'mongodb+srv://bharath:Livethegame14@firstclustertest.jgypz.mongodb.net/test?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true //*9deprcated error fix for update operations
		}
	)
	.then((x) => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
	})
	.catch((err) => {
		console.error('Error connecting to mongo', err);
	});

const Schema = mongoose.Schema;

var TrainerSchema = new Schema({
	trainername: String,
	traineraddress: String,
	traineremail: String,
	trainerph: String,
	traineredu: String,
	trainerpwd: String,
	trainerskill: String,
	trainerexp: String,
	tracours: String,
	tradate: String,
	tracouid: String,
	tracoubtch: String,
	isApproved: Boolean
});
var TrainerData = mongoose.model('Trainer', TrainerSchema);
module.exports = TrainerData;
