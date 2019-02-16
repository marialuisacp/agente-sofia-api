var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var app = express();

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader("Content-Type", "application/json");
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db;
var url = 'mongodb://localhost:27017/sofia'; 

// mongodb.MongoClient.connect(url, function (err, database) {
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	db = database;
	console.log("Database connection ready");
	var server = app.listen(process.env.PORT || 8888, function () {
		var port = server.address().port;
		console.log("App now running on port", port);
    });
});

app.get("/api/cases", function(req, res) {
    db.collection('cases').find({}).sort({ time: -1 }).toArray(function(err, docs) {
    	if (err) {
    		handleError(res, err.message, "Failed to get cases.");
    	} else {
    		res.status(200).json(docs);
    	}
    });
});

app.post("/api/case", function(req, res) {
	var newCase = req.body;
	db.collection('cases').insertOne(newCase, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to create new case.");
		} else {
			res.status(201).json(doc.ops[0]);
		}
	});
});

app.get("/api/remove/", function(req, res) {
	var id_product = parseInt(req.params.id);
	db.collection('cases').remove({});
	var obj = { t: 2, message: 'Removido com sucesso' };
	res.status(200).json(obj);
});


