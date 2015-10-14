var express = require('express');
var bodyParser = require('body-parser')

var app = express();

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/users/', function (req,res){
	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		    console.log('Connection established to', url);
			var collection = db.collection('users');			
			collection.find({}).toArray(function (err, result) {
				if (err) {
					console.log(err);
				} else if (result.length) {
					var passDataList = JSON.parse(JSON.stringify(result));
					console.log("passDataList >>> "+passDataList);	
					var ret = "";
					for(var passIdx in passDataList){
						var username = passDataList[passIdx].username;
						console.log("Search result >>> "+username);	
						ret += username + "|";
					}
					res.send("Search result: "+ret);
				}
				db.close();
			});
		}			
	});
});

app.get('/users/:username', function (req,res){
	var userName = req.params.username;
	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		    console.log('Connection established to', url);
			var collection = db.collection('users');			
			collection.find({username:userName}).toArray(function (err, result) {
				if (err) {
					console.log(err);
				} else if (result.length) {
					var passDetails = JSON.parse(JSON.stringify(result[0].username));
					console.log("Search result >>> "+passDetails);	
					res.send("Search result: "+passDetails);
				}
				db.close();
			});
		}			
	});
});

app.get('/users/address/:address', function (req,res){
	var _address = req.params.address;
	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		   	console.log('Connection established to', url);
			console.log('Search for '+_address);
			var collection = db.collection('users');			
			collection.find({address:new RegExp(_address, 'i')}).toArray(function (err, result) {
				if (err) {
					console.log(err);
				} else if (result.length) {
					var dataList = JSON.parse(JSON.stringify(result));
					console.log("passDataList >>> "+dataList);	
					var ret = "";
					for(var passIdx in dataList){
						var username = dataList[passIdx].username;
						var address = dataList[passIdx].address;
						console.log("Search result >>> "+username+"."+address);	
						ret += username+"."+address + " | ";
					}
					res.send("Search result: "+ret);
				} else {
					res.send("Search not found");
				}
				db.close();
			});
		}			
	});
});

app.post('/users/', function (req, res) {
	var objData = req.body;
  	console.log('Got a POST request at /users');
  	console.log(objData);
	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		   	console.log('Connection established to', url);
			var collection = db.collection('users');			
			collection.insert(objData, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					res.send("Insert "+objData.username+" success.");
				}
				db.close();
			});
		}			
	});
});

app.put('/users/occupation/', function (req, res) {
	var objData = req.body;
	console.log('Got a PUT request at /users');
	console.log(objData);

	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		   	console.log('Connection established to', url);
			var collection = db.collection('users');			
			collection.update({username:objData.username},{$set:{occupation:objData.occupation}},{w:1}, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					res.send("Update "+objData.username+" success.");
				}
				db.close();
			});
		}			
	});
});

app.put('/users/address/', function (req, res) {
	var objData = req.body;
	console.log('Got a PUT request at /users');
	console.log(objData);

	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		   	console.log('Connection established to', url);
			var collection = db.collection('users');			
			collection.update({username:objData.username},{$set:{address:objData.address}},{w:1}, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					res.send("Update "+objData.username+" success.");
				}
				db.close();
			});
		}			
	});
});

app.delete('/users/:username', function (req, res) {
	var _username = req.params.username;
	console.log('Got a DELETE request at /users');

	var mongodb = require('mongodb'); 
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/users';
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			res.send(JSON.stringify("Error"));
		} else {
		   	console.log('Connection established to', url);
			var collection = db.collection('users');			
			collection.remove({username:_username}, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					res.send("Delete "+_username+" success.");
				}
				db.close();
			});
		}			
	});
});

	var server = app.listen(3000, function () {
  	var host = server.address().address;
  	var port = server.address().port;

  	console.log('Example app listening at http://%s:%s', host, port);
});
