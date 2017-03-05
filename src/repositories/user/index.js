"use strict";

const logger = require('winston')
const Q = require('q')

//private global properties
var UserModel

function userRepository(mongoose){
	UserModel = require('../../models/user')(mongoose)
	return {
		findUser,
		findAllUsers,
		insertUser
	}
}

function findAllUsers(){
	logger.verbose("Finding all users")
	var promise = UserModel.find(function(error, users){
		if (error){
			logger.error(error)
			throw error
		}
		logger.verbose("Found all users : " +users)
	}).exec()
	return promise
}

//lookup in a database to find the user object
function findUser(username){
	var where = { "username" : username }
	logger.verbose("Finding user with infos : " + where)
	var promise = UserModel.findOne(where, function(error, obj){
		if (error){
			logger.error(error)
			throw error		
		}
	}).exec()
	return promise
}

function insertUser(user){
	var User = new UserModel(user)
	logger.verbose("Saving user with infos : " +user)
	var promise = User.save(function(error, obj){
		if (error){
			logger.error(error)
			throw error
		}
	})
	return promise
}

function deleteUser(User){
	var where = { username: User.username }
	logger.verbose("Deleting user with infos : " +where)
	var promise = UserModel.remove(where, function (error) {
		if (error){
			logger.error(error)
			throw error
		}
	})
	return promise
}

function updateUser(User){
	var where = { username: 'user' }
	var set = { language: 'en' }
	var options = {}
	logger.verbose("Updating user with infos : " +set+ " where : " +where)
	var promise = User.update(where, set, options, function (error, raw) {
		if (error){
			logger.error(error)
			throw error
		}
		logger.verbose("The raw response from Mongo was : ", raw);
	})
	return promise
}

module.exports = userRepository