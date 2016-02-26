'use strict';

 /**
 * match controller file * autogenerated by mongoose-scaffold-crud **/

var matches = require('express').Router(),
    Model = require('../models/model-matches.js');

matches.get('/', function(req, res) {
    Model.find(function(err, matches){
        if(err) {
            return res.send('500: Internal Server Error', 500);
        }
        return res.json(matches);
    });
});

matches.get('/:id', function(req, res) {
    var id = req.params.id;
    Model.findOne({_id: id}, function(err, match){
        if(err) {
            return res.send('500: Internal Server Error', 500);
        }
        if(!match) {
            return res.end('No such match');
        }
        return res.json(match.rooms);
    });
});

module.exports = matches;