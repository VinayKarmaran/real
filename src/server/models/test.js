const mongoose=require('mongoose')
const Schema = mongoose.Schema

const TestSchema = new Schema({
    t :{
        type: String,
        required:[true,'t field is required']
        // required:[true,'t field is required']
    },
})

    

const Test = mongoose.model('Test',TestSchema)
module.exports= Test
// const Message = mongoose.model('message',MessageSchema)
// module.exports= Message