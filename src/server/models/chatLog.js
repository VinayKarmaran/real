const mongoose=require('mongoose')
const Schema = mongoose.Schema

const ChatLogSchema = new Schema({
    content :{
        type: String,
        // required:[true,'t field is required']
    },
    sender :{
        type: String,
        required:[true,'t field is required']
    },
})

    

// const Test = mongoose.model('Test',TestSchema)
// module.exports= Test
const ChatLog = mongoose.model('ChatLog',ChatLogSchema)
module.exports= ChatLog