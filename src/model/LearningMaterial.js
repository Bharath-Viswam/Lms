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

var MaterialSchema = new Schema({
	title: String,
	url: String,
	desc: String,
	file: String
});
var MaterialDatacsa = mongoose.model('materialscsa', MaterialSchema);
module.exports = MaterialDatacsa;
