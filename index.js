const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');

const MaterialData = require('./src/model/StudentLearningData');
const MaterialDatacsa = require('./src/model/LearningMaterial');
const StudentData = require('./src/model/StudentData');
const TrainerData = require('./src/model/TrainerData');
const MaterialDatadsa = require('./src/model/TrainerLearning');
// const MaterialDatadsa=require('./src/model/TrainerLearning');

var app = express();
app.use(bodyParser.json());
app.use(cors());
const path = require('path');
app.use(express.static('./dist/lms-frontend'));

// validation middle ware
// admin
function verifyToken(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send('unautharized request');
	}

	let token1 = req.headers.authorization.split(' ')[1];

	if (token1 == 'null') {
		return res.status(401).send('unautharized request');
	}

	let payload = jwt.verify(token1, 'secretkey');
	console.log(payload);

	if (!payload) {
		return res.status(401).send('unautharized request');
	}
	req.userId = payload.subject;
	next();
}

// multer
const DIR = '../Lms-Frontend/src/assets/uploads';
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLocaleLowerCase();
		cb(null, fileName);
	}
});
var upload = multer({ storage: storage });
// add trainerfsd
app.post('/api/traineraddmaterial', upload.single('file'), (req, res) => {
	const file = req.file;
	console.log(file.filename);
	console.log(req.body);
	var materials = MaterialData({
		title: req.body.title,
		url: req.body.url,
		desc: req.body.desc,
		file: req.file.filename
	});
	materials = materials.save();
	res.send();
});
// add trainerdsa maerial
app.post('/api/trainerdsaaddmaterial', upload.single('file'), (req, res) => {
	const file = req.file;
	console.log(file.filename);
	console.log(req.body);
	var materials = MaterialDatadsa({
		title: req.body.title,
		url: req.body.url,
		desc: req.body.desc,
		file: req.file.filename
	});
	materials = materials.save();
	res.send();
});
// add csa material
app.post('/api/trainercsaaddmaterial', upload.single('file'), (req, res) => {
	const file = req.file;
	console.log(file.filename);
	console.log(req.body);
	var materials = MaterialDatacsa({
		title: req.body.title,
		url: req.body.url,
		desc: req.body.desc,
		file: req.file.filename
	});
	materials = materials.save();
	res.send();
});
// getting learning material fsd

app.get('/api/materials', function(req, res) {
	console.log('ok');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	MaterialData.find().then(function(materials) {
		console.log(materials);
		res.send(materials);
	});
});
// get dsa learning material
app.get('/api/materialsdsa', function(req, res) {
	console.log('ok');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	MaterialDatadsa.find().then(function(materials) {
		console.log(materials);
		res.send(materials);
	});
});

// getting csa material
app.get('/api/materialscsa', function(req, res) {
	console.log('ok');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	MaterialDatacsa.find().then(function(materials) {
		console.log(materials);
		res.send(materials);
	});
});

// signup and login portion

// student signup
app.post('/api/studentsignup', (req, res) => {
	let studentData = req.body;

	var student = {
		studentname: studentData.name,
		studentaddress: studentData.address,
		studentemail: studentData.email,
		studentph: studentData.ph,
		studentedu: studentData.edu,
		stucours: studentData.courses,
		studentpwd: studentData.pwd,
		isApproved: false
	};
	console.log(student);
	var students = new StudentData(student);
	students.save();
});

// login student
app.post('/api/studentlogin', (req, res) => {
	let studentData = req.body;

	StudentData.findOne(
		{ studentemail: studentData.studentemail, studentpwd: studentData.studentpwd, isApproved: 'true' },
		(err, studentData) => {
			if (studentData) {
				console.log('student SUCCESSFULLY LOGGEDIN');

				let payload = { subject: studentData.studentemail + studentData.studentpwd };
				let token = jwt.sign(payload, 'secretkey');
				res.status(200).send({ token });
			} else {
				console.log('FAILED TO LOGIN');
				res.status(401).send('invalid credential');
			}
		}
	);
});

//admin login
admineusername = 'admin@gmail.com';
adminepwd = 'admin@123';

// app.post('/adminlogin',(req,res)=>{
//     let adminData=req.body
//     if(!admineusername){
//         res.status(401).send('invalid username');
//     }
//     if(adminepwd!==adminData.adminepwd){
//         res.status(401).send('invalid password');
//     }
//     else{
//         let payload = {subject:admineusername+adminepwd}
//         let token1 = jwt.sign(payload,'secretkey')
//         console.log('admin logged in');
//         res.status(200).send({token1})
//     }
//     })

// trainer signup

app.post('/api/trainersignup', (req, res) => {
	let trainerData = req.body;

	var trainer = {
		trainername: trainerData.name,
		traineraddress: trainerData.address,
		traineremail: trainerData.email,
		trainerph: trainerData.ph,
		traineredu: trainerData.edu,
		trainerpwd: trainerData.pwd,
		trainerskill: trainerData.skill,
		trainerexp: trainerData.exp,
		tracours: trainerData.courses,
		isApproved: false
	};
	console.log(trainer);
	var trainers = new TrainerData(trainer);
	trainers.save();
});

// trainer login

app.post('/api/trainerlogin', (req, res) => {
	let trainerData = req.body;

	//    admin login
	if (trainerData.traineremail == admineusername && trainerData.trainerpwd == adminepwd) {
		let payload = { subject: admineusername + adminepwd };
		let token1 = jwt.sign(payload, 'secretkey');
		console.log('admin logged in');
		res.status(200).send({ role: 'admin', msg: 'Admin logged In', token1 });
	} else {
		// trainer login
		TrainerData.findOne(
			{ traineremail: trainerData.traineremail, trainerpwd: trainerData.trainerpwd, isApproved: 'true' },
			(err, trainerData) => {
				if (trainerData) {
					console.log('trainer SUCCESSFULLY LOGGEDIN');

					let payload = { subject: trainerData.traineremail + trainerData.trainerpwd };
					let token3 = jwt.sign(payload, 'secretkey');
					res.status(200).send({ role: 'trainer', msg: 'trainer logged In', token3 });
				} else {
					console.log('FAILED TO LOGIN trainer');
					res.status(401).send('invalid credential');
				}
			}
		);
	}
});

// end signup and login

// get student details for approval
app.get('/api/studentdetails', verifyToken, function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'false' }).then(function(students) {
		console.log('details of student need aproval');
		res.send(students);
	});
});

// get trainer details for approval
app.get('/api/trainerdetails', verifyToken, function(req, res) {
	console.log('tariner acess server');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	TrainerData.find({ isApproved: 'false' }).then(function(trainers) {
		console.log('details of tariner need aproval');
		console.log(trainers);
		res.send(trainers);
	});
});
// approve students
app.put('/api/approve', verifyToken, function(req, res) {
	console.log(req.body);
	id = req.body._id;
	studate = req.body.studate;
	stucouid = req.body.stucouid;
	console.log(stucouid);
	StudentData.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				isApproved: 'true',
				studate: studate,
				stucouid: stucouid
			}
		}
	).then(() => {
		console.log('students approval successful');
		res.send();
		//  aprove mail for student
		approvemail(id);
	});
});
// print approval student FSD001 list
app.get('/api/aprovestulist', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'true', stucouid: 'FSD001' }).then(function(students) {
		console.log('aproved student list');
		res.send(students);
	});
});
// print approval student FSD002 list
app.get('/api/aprovestufsd2list', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'true', stucouid: 'FSD002' }).then(function(students) {
		console.log('aproved student list');
		res.send(students);
	});
});
// print approval student DSA001 list
app.get('/api/aprovestudsa1list', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'true', stucouid: 'DSA001' }).then(function(students) {
		console.log('aproved student list');
		res.send(students);
	});
});
// print approval student DSA002 list
app.get('/api/aprovestudsa2list', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'true', stucouid: 'DSA002' }).then(function(students) {
		console.log('aproved student list');
		res.send(students);
	});
});
// print approval student csa001 list
app.get('/api/aprovestucsa1list', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'true', stucouid: 'CSA001' }).then(function(students) {
		console.log('aproved student list');
		res.send(students);
	});
});
// print approval student csa002 list
app.get('/api/aprovestucsa2list', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');
	StudentData.find({ isApproved: 'true', stucouid: 'CSA002' }).then(function(students) {
		console.log('aproved student list');
		res.send(students);
	});
});
// print approved dsa trainer list
app.get('/api/aprovetralist', verifyToken, function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');

	TrainerData.find({ isApproved: 'true', tracouid: 'DSA' }).then(function(trainers) {
		res.send(trainers);
	});
});
// print approved fsd trainer list
app.get('/api/aprovefsdtralist', verifyToken, function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');

	TrainerData.find({ isApproved: 'true', tracouid: 'FSD' }).then(function(trainers) {
		console.log(trainers);
		res.send(trainers);
	});
});
// print approved csa trainer list
app.get('/api/aprovecsatralist', verifyToken, function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: POST,PATCH, GET, DELETE, PUT, OPTIONS');

	TrainerData.find({ isApproved: 'true', tracouid: 'CSA' }).then(function(trainers) {
		console.log(trainers);
		res.send(trainers);
	});
});
// decline students
app.delete('/api/declinestu/:id', verifyToken, (req, res) => {
	id = req.params.id;
	StudentData.findByIdAndDelete({ _id: id }).then(() => {
		console.log('student declined');
		res.send();
	});
});

// delete entrolled student
app.delete('/api/deletestu/:id', verifyToken, (req, res) => {
	id = req.params.id;
	StudentData.findByIdAndDelete({ _id: id }).then(() => {
		console.log('entrolled student deleted');
		res.send();
	});
});

// get studentprof for update

app.get('/api/:id', verifyToken, (req, res) => {
	const id = req.params.id;
	StudentData.findOne({ _id: id }).then((student) => {
		res.send(student);
	});
});

// update student prof
app.put('/api/updatestuprf', verifyToken, (req, res) => {
	console.log(req.body);
	(id = req.body._id),
		(studentname = req.body.studentname),
		(studentaddress = req.body.studentaddress),
		(studentemail = req.body.studentemail),
		(studentph = req.body.studentph),
		(studentedu = req.body.studentedu),
		(stucours = req.body.stucours);
	StudentData.findByIdAndUpdate(
		{ _id: id },
		// find with the id and update with the set ie new productid mans that comming from the frontend
		{
			$set: {
				studentname: studentname,
				studentaddress: studentaddress,
				studentemail: studentemail,
				studentph: studentph,
				studentedu: studentedu,
				stucours: stucours
			}
		}
	).then(function() {
		res.send();
	});
});

// tariner in admin

// approve trainer
app.put('/api/approvetrainer', verifyToken, function(req, res) {
	id = req.body._id;
	console.log(req.body);
	tradate = req.body.tradate;
	tracouid = req.body.tracouid;
	tracoubtch = req.body.tracoubtch;
	console.log(tracouid);
	TrainerData.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				isApproved: 'true',
				tradate: tradate,
				tracouid: tracouid,
				tracoubtch: tracoubtch
			}
		}
	).then(() => {
		console.log('trainer approval success');

		res.send();
		// mail to trainer
		approvemailtrainer(id);
	});
});

// decline trainer
app.delete('/api/declinetrar/:id', verifyToken, (req, res) => {
	id = req.params.id;
	TrainerData.findByIdAndDelete({ _id: id }).then(() => {
		console.log('tariner declined');
		res.send();
	});
});
// delete entrolled trainer
app.delete('/api/deletetra/:id', verifyToken, (req, res) => {
	id = req.params.id;
	TrainerData.findByIdAndDelete({ _id: id }).then(() => {
		console.log('entrolled tariner deleted');
		res.send();
	});
});
// get tarinerprof for update

app.get('/api/edittra/:id', verifyToken, (req, res) => {
	const id = req.params.id;
	TrainerData.findOne({ _id: id }).then((trainer) => {
		res.send(trainer);
		console.log(trainer);
	});
});

// update trainer prof
app.put('/api/updatetraprf', verifyToken, (req, res) => {
	// console.log(req.body);
	(id = req.body._id),
		(trainername = req.body.trainername),
		(traineraddress = req.body.traineraddress),
		(trainerph = req.body.trainerph),
		(traineredu = req.body.traineredu),
		(trainerskill = req.body.trainerskill),
		(trainerexp = req.body.trainerexp),
		(tracours = req.body.tracours),
		(tracoubtch = req.body.tracoubtch);
	TrainerData.findByIdAndUpdate(
		{ _id: id },
		// find with the id and update with the set ie new productid mans that comming from the frontend
		{
			$set: {
				trainername: trainername,
				traineraddress: traineraddress,
				trainerph: trainerph,
				traineredu: traineredu,
				trainerskill: trainerskill,
				trainerexp: trainerexp,
				tracours: tracours,
				tracoubtch: tracoubtch
			}
		}
	).then(function() {
		res.send();
	});
});
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + './dist/lms-frontend/index.html'));
});
// email to trainer
function approvemailtrainer(id) {
	TrainerData.findOne({ _id: id }).then((trainer) => {
		console.log(trainer);
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'sruthigopinath42@gmail.com',
				pass: 'lqdvrkpnhybtcfiy'
			}
		});

		var mailOptions = {
			from: 'sruthigopinath42@gmail.com',
			to: trainer.traineremail,
			subject: 'Account Approved',
			html: `<h2>Hi, ${trainer.trainername},</h2>
               <p><b>Your account for ict accademy trainer is approved.</b>
               You are now a registerd trainer of ICTK's ${trainer.tracours} course, ${trainer.tracoubtch} batches.
               Now you can login using your registerd email Id and password.</p>
               check the below link to know more <a href="http://localhost:4200/tralogin">here</a>

               <p>Thanks for choosing ict accadamy,happy teaching and learning</p>`
		};
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
				console.log('mail not send');
			} else {
				console.log(info.response);
				console.log('mail sent');
			}
		});
	});
}
// email to students
function approvemail(id) {
	StudentData.findOne({ _id: id }).then((student) => {
		console.log(student);
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'sruthigopinath42@gmail.com',
				pass: 'lqdvrkpnhybtcfiy'
			}
		});

		var mailOptions = {
			from: 'sruthigopinath42@gmail.com',
			to: student.studentemail,
			subject: 'Account Approved',
			html: `<h2>Hi ${student.studentname}</h2>, 
        <p><b>Your account for ict accademy student is approved.</b>
        You belong to ${student.stucours} course and ${student.stucouid} batch.
        Now you can login using your registerd email Id and password</P>
        check the below link <a href="http://localhost:4200/stulogin">here</a>

        <p>Thanks for choosing ICT accadamy.happy learning...</p>`
		};
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
				console.log('mail not send');
			} else {
				console.log(info.response);
				console.log('mail sent');
			}
		});
	});
}

app.listen(3000, () => {
	console.log('server is ready');
});
