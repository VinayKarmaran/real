const mongoose=require('mongoose')
const Schema = mongoose.Schema

const UsersSchema = new Schema({
    username :{
        type: String,
        required:[true,'Username field is required']
    },
    password:{
        type: String,
        required:[true,'Username field is required']
    }
})

// const MessageSchema = new Schema({
//     content :{
//         type: String
//         // required:[true,'Username field is required']
//     },
//     sender:{
//         type: String,
//         required:[true,'sender field is required']
//     },
//     date :{
//         type: String
//         // required:[true,'Username field is required']
//     },
//     time:{
//         type : String
//     }
// })

const Users = mongoose.model('users',UsersSchema)
module.exports= Users
// const Message = mongoose.model('message',MessageSchema)
// module.exports= Message