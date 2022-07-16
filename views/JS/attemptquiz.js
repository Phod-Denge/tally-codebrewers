var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



mongoose.connect('mongodb+srv://sushantdhuria:sushant123@cluster0.h63jbum.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var quiz = require('../../models/quiz');
let {get_quiz_by_quizname,get_question_by_id}= require('../../routes/queries')

let Quiz = get_quiz_by_quizname('test quiz3')
Quiz.then(data=>
{
    // console.log(data)
    for(let i=0;i<data[0].questionIDs.length;i++)
    {
        let ques=get_question_by_id(data[0].questionIDs[i])
        ques.then(question=>{
            // console.log(question)
            var obj={
                question:question[0].questionText,
                a:question[0].options[0],
                b:question[0].options[1],
                c:question[0].options[2],
                d:question[0].options[3],
                correct:question[0].answer
            }
           quizData.push(obj)
        //    console.log(i)
        if(i==data[0].questionIDs.length-1)
            console.log(quizData)
        })
    }
})
// let timer=document.getElementById("#timer");

// var deadline = new Date("July 18, 2022 23:59:00").getTime();
// var x = setInterval(function() {
// var now = new Date().getTime();
// var t = deadline - now;
// var days = Math.floor(t / (1000 * 60 * 60 * 24));
// var hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
// var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
// var seconds = Math.floor((t % (1000 * 60)) / 1000);
// document.getElementById("timer").innerHTML = days + "d " 
// + hours + "h " + minutes + "m " + seconds + "s ";
//     if (t < 0) {
//         clearInterval(x);
//         document.getElementById("timer").innerHTML = "EXPIRED";
//     }
// }, 1000);


// let index = 0;
// let correct = 0,
// incorrect = 0,
// total = quizData.length;
// let questionBox = document.getElementById("questionBox");
// let allInputs = document.querySelectorAll("input[type='radio']")
// const loadQuestion = () => {
// if (total === index) {
//     return quizEnd()
// }
// reset()
// const data = quizData[index]
// questionBox.innerHTML = `${index + 1}) ${data.question}`
// allInputs[0].nextElementSibling.innerText = data.a
// allInputs[1].nextElementSibling.innerText = data.b
// allInputs[2].nextElementSibling.innerText = data.c
// allInputs[3].nextElementSibling.innerText = data.d
// }

// document.querySelector("#submit").addEventListener(
// "click",
// function() {
//     const data = quizData[index]
//     const ans = getAnswer()
//     if (ans === data.correct) {
//         correct++;
//     } else {
//         incorrect++;
//     }
//     index++;
//     loadQuestion()
// }
// )

// const getAnswer = () => {
// let ans;
// allInputs.forEach(
//     (inputEl) => {
//         if (inputEl.checked) {
//             ans = inputEl.value;
//         }
//     }
// )
// return ans;
// }

// const reset = () => {
// allInputs.forEach(
//     (inputEl) => {
//         inputEl.checked = false;
//     }
// )
// }

// const quizEnd = () => {
// // console.log(document.getElementsByClassName("container"));
// document.getElementsByClassName("container")[0].innerHTML = `
//     <div class="col">
//         <h3 class="w-100"> Hii, you've scored ${correct} / ${total} </h3>
//     </div>
// `
// }
// loadQuestion(index);