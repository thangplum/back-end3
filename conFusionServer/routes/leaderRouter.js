const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');
leaderRouter.use(bodyParser.json());
const mongoose = require('mongoose');
const Leaders = require('../models/leaders.js');

leaderRouter.route('/')
.get((req, res, next) => {
	Leaders.find({})
	.then((leader) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', "application/json");
		res.json(leader);
	}, (err)=> next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyAdmin, (req, res, next) => {
	Leaders.create(req.body)
	.then((leader) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.put(authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on leaders');
})
.delete(authenticate.verifyAdmin, (req, res, next) => {
	Leaders.deleteMany({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err)=>next(err))
	.catch((err)=>next(err));
});

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
	Leaders.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing leaders');
})
.put(authenticate.verifyAdmin, (req, res, next) => {
	res.write('Updating the leader: ' + req.params.leaderId + "\n");
	Leaders.findByIdAndUpdate(req.params.leaderId, {
		$set: req.body}, {new: true})
	.then((leader)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyAdmin, (req, res, next) => {
	Leaders.findByIdAndDelete(req.params.leaderId)
	.then((resp)=>{
		res.statusCode = 200;
		res.setHeader('statusCode', 'application/json');
		res.json(resp);
	},(err)=>next(err))
	.catch((err)=>next(err));
});



module.exports = leaderRouter;