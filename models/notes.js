const mongoose=require('mongoose')
const {Schema}=mongoose;

const NotesSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId, //connecting user and notes(similar to foreign key)
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:Date.now
    },
    date:{
        type:String,
        default:Date.now
    },
});

module.exports=mongoose.model('notes',NotesSchema)