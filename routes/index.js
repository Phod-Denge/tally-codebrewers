var express = require('express');
var router = express.Router();
var User = require('../models/user');
var quiz = require('../models/quiz');
var question = require('../models/question');
let quiz_name="";
let curr_user_name=""
let curr_user_email=""
router.get('/',function(req,res)
{
	return res.render('home.ejs')
}
);

router.get('/createquiz',function(req,res){
	return res.render('createquiz.ejs');
});
router.post('/createquiz',function(req,res){
	console.log(req.body)
	var quizInfo = req.body;
	console.log(curr_user_email)
	var new_quiz = new quiz({
		quizname:quizInfo.quizName,
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
					{ $push: { questonIDs: count+1  } },
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
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			curr_user_name=data.username
			curr_user_email=data.email
			return res.render('data.ejs', {"name":data.username,"email":data.email});
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