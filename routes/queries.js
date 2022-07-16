var quiz = require('../models/quiz');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


async function get_quiz_by_user(username){
  const res = await quiz.find({owner:username});
  return res;
  }




  module.exports = {get_quiz_by_user} 

