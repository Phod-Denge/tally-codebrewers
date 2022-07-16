var mongoose = require('mongoose')
var quizSchema = mongoose.Schema({

    quizname: {
        type: String,
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
    questonIDs:{
        type  :Array,
        default:[]
    }
})
module.exports = mongoose.model('quiz',quizSchema)
