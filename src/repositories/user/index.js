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
		insertUser,
		deleteUser,
		updateUser,
		updateUsers
	}
}

//lookup in the database to find all the user objects
//when promise completes with success, returns the user objects we're looking for
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

//lookup in the database to find the user object
//when promise completes with success, returns the user object we're looking for
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

//insert in the database the datas passed as param as a user's content
//when promise completes with success, returns nothing
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

//WARNING be sure that the param will match the number of rows you want before calling this
//example : if you want an user to be removed, ensure that the param you pass is a unique value in all case
//ids are perfect for that or even emails if you checked their unicity before adding the user to the database in the registration process
//delete in the database the user matching the object properties passed as param
//when promise completes with success, returns the number of docs removed, not the document itself
//{"ok":1,"n":0}
function deleteUser(where){
	logger.verbose("Deleting user with infos : " +where)
	var promise = UserModel.remove(where, function (error) {
		if (error){
			logger.error(error)
			throw error
		}
	}).exec()
	return promise
}

//update in the database the user matching the object properties passed as first param
//using the second param object properties as new values for the only one/first database object matched
//when promise completes with success, returns this sort of things
//{ ok: 1, n: 0, nModified: 0, upserted: [] }
function updateUser(where, set){
	var options = {}
	logger.verbose("Updating user with infos : " +set+ " where : " +where)
	var promise = UserModel.update(where, set, options).exec().then(function(raw){
		logger.verbose("The raw response from Mongo was : ", raw)
	}, function(error){
		if (error){
			logger.error(error)
			throw error
		}
	})
	return promise
}

//update in the database the users matching the object properties passed as first param
//using the second param object properties as new values for all the database objects matched
//when promise completes with success, returns
function updateUsers(where, set){
	var options = { multi: true }
	logger.verbose("Updating users with infos : " +set+ " where : " +where)
	var promise = UserModel.update(where, set, options).exec().then(function(raw){
		logger.verbose("The raw response from Mongo was : ", raw)
	}, function(error){
		if (error){
			logger.error(error)
			throw error
		}
	})
	return promise
}

module.exports = userRepository