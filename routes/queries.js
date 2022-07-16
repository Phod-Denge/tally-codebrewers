var quiz = require('../models/quiz');
var question = require('../models/question');
var attempter = require('../models/attempter');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


async function get_quiz_by_user(username){
  const res = await quiz.find({owner:username});
  return res;
}
async function get_quiz_by_quizname(name){
  const res = await quiz.find({quizname:name});
  return res;
}
async function get_question_by_id(id){
  const res = await question.find({questionId:id});
  return res;
}
async function get_quiz_by_quizid(id)
{
  const res = await quiz.find({quizid:id});
  return res;
}
async function get_answer_by_username(name,id)
{
  const res = await attempter.find({name:name,quizid:id});
  return res;
}
async function get_attempter(name,id)
{
  const res = await attempter.find({name:name,quizid:id});
  return res;
}

module.exports = {get_quiz_by_user,get_quiz_by_quizname,get_question_by_id,get_quiz_by_quizid,get_answer_by_username,get_attempter} 

