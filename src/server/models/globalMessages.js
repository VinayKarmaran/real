const mongoose=require('mongoose')
const Schema = mongoose.Schema

const GlobalMessageSchema = new Schema({
    content :{
        type: String,
        // required:[true,'t field is required']
    },
    sender :{
        type: String,
        required:[true,'t field is required']
    },
    date:{
        type: String
    },
    time:{
        type: String
    }
})

    

// const Test = mongoose.model('Test',TestSchema)
// module.exports= Test
const GlobalMessage = mongoose.model('GlobalMessages',GlobalMessageSchema)
module.exports= GlobalMessage