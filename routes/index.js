var express = require('express');
var router = express.Router();
var User = require('../models/user');
var quiz = require('../models/quiz');
var question = require('../models/question');
var attempter = require('../models/attempter');
let {get_quiz_by_user,get_attempter,get_question_by_id,get_quiz_by_quizid,get_answer_by_username}= require('./queries')
let quiz_name="";
let curr_user_name=""
let curr_user_email=""
let attempter_name=""
let quiz_id="";

router.get('/',function(req,res)
{
	return res.render('home.ejs')
}
);
router.get('/attemptques/:id',function(req,res){
	// console.log(req.query)
	attempter.findOneAndUpdate(
		{ quizid: quiz_id ,name:attempter_name}, 
		{ $push: { answers: req.query.option  } },
	   function (error, success) {
			 if (error) {
				 console.log(error);
			 } else {
				//  console.log(success);
			 }
		 });
	let id=parseInt(req.params.id);
	let Quiz = get_quiz_by_quizid(quiz_id)
Quiz.then(data=>
{
	console.log(data)
	if(id==data[0].questionIDs.length)
            return res.render('quiz_completed.ejs');
        
        let ques=get_question_by_id(data[0].questionIDs[id])
        ques.then(question=>{
            console.log(question)
            var obj={
                question:question[0].questionText,
                a:question[0].options[0],
                b:question[0].options[1],
                c:question[0].options[2],
                d:question[0].options[3],
                correct:question[0].answer
            }
        //    console.log(i)
        res.render('attemptquiz.ejs',{id:id+1,ques:obj});
	})
})
})
router.post('/attemptquiz',function(req,res){
	attempter_name=req.body.Name
	console.log(quiz_id)
	let is_new= get_attempter(attempter_name,quiz_id);
	is_new.then(data=>{
		if(data.length!=0)
		{
			return res.render('start_quiz.ejs',{message:"You Have Already Attempted the quiz"});
		}
		else
		{
			var new_attempter = new attempter({
				name:attempter_name,
				quizid:quiz_id
			});
			new_attempter.save(function(err, Person){
				if(err)
					console.log(err);
				else
				{
					console.log('attempter created succefully');
					return res.redirect('/attemptques/0')
				}
			});
		}
	})


});
router.get('/startquiz/:id',function(req,res){
	quiz_id=req.params.id

	return res.render('start_quiz.ejs',{message:""});
});
router.get('/viewresults',function(req,res){
	let results=get_answer_by_username(attempter_name,quiz_id);
	results.then(d=>{
		let answers=d[0].answers
		let score =0;
		let Quiz = get_quiz_by_quizid(quiz_id)
		correct_ans=[]
		Quiz.then(data=>
		{
			for(let i=0;i<data[0].questionIDs.length;i++)
			{
				
				let ques=get_question_by_id(data[0].questionIDs[i])
				ques.then(question=>{
					// console.log(question)
					correct=question[0].answer
					correct_ans.push(correct)
					if(correct==answers[i+1])
					{
						score++; 	
					}
					if(i==data[0].questionIDs.length-1)
					{
						console.log(correct_ans)
						return res.render('results.ejs',{score:score,total:data[0].questionIDs.length,correct:correct_ans,answers:answers});
					}
				})
				
			}
			
		})
	})
});
router.get('/createquiz',function(req,res){
	return res.render('createquiz.ejs');
});
router.post('/createquiz',function(req,res){
	console.log(req.body)
	var quizInfo = req.body;
	console.log(curr_user_email)
	quiz.count({}, function( err, count){
		var new_quiz = new quiz({
			quizname:quizInfo.quizName,
			quizid:count+1,
			quizdescription:quizInfo.quizDescription,
			owner: curr_user_name,
			owneremail: curr_user_email
		});
		new_quiz.save(function(err, Person){
			if(err)
				console.log(err);
			else
			{
				quiz_name=quizInfo.quizName
				console.log('quiz created succefully');
				return res.render('question.ejs');
			}
		});
		});
	

	
});
router.post('/createquestion',function(req,res){
	var quesInfo = req.body;
	question.count({}, function( err, count){
		var new_question = new question({
			quizname:quiz_name,
			questionId:count+1,
			questionText: quesInfo.question,
			answer: quesInfo.answer,
			options:[quesInfo.option1,quesInfo.option2,quesInfo.option3,quesInfo.option4]
		});
		new_question.save(function(err, ques){
			if(err)
				console.log(err);
			else
			{
				quiz.findOneAndUpdate(
					{ quizname: quiz_name }, 
					{ $push: { questionIDs: count+1  } },
				   function (error, success) {
						 if (error) {
							 console.log(error);
						 } else {
							 console.log(success);
						 }
					 });
				console.log('question created succefully');
				return res.render('question.ejs');
			}
		});
	})
	
});
router.get('/signup', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/signup', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login2.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		// console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			curr_user_name=data.username
			curr_user_email=data.email
			let quizzes=get_quiz_by_user(data.username);
			quizzes.then(d=>{
				console.log(d[0])
				return res.render('data.ejs', {"name":data.username,"email":data.email,"quizzes":d});
			})
			
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});
module.exports=router;