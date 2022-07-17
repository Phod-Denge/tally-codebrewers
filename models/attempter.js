var mongoose = require('mongoose')
var attempterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quizid: {
        type: Number,
        required: true
    },
    answers:{
        type  :Array,
        default:[]
    }
})
module.exports = mongoose.model('attempter',attempterSchema)