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

var StudentSchema = new Schema({
	studentname: String,
	studentaddress: String,
	studentemail: String,
	studentph: String,
	studentedu: String,
	studentpwd: String,
	stucours: String,
	studate: String,
	stucouid: String,
	isApproved: Boolean
});
var StudentData = mongoose.model('Student', StudentSchema);
module.exports = StudentData;
