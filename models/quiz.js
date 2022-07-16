var mongoose = require('mongoose')
var quizSchema = mongoose.Schema({

    quizname: {
        type: String,
        required: true
    },
    quizid: {
        type: Number,
        required: true
    },
    quizdescription: {
        type: String,
        required: true
    },
    owner: {
        type: String,
    },
    owneremail: {
        type: String,
    },
    questionIDs:{
        type  :Array,
        default:[]
    }
})
module.exports = mongoose.model('quiz',quizSchema)
