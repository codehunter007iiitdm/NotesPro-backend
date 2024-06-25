const mongoose=require('mongoose');




const mongoURI="mongodb+srv://notes_admin:notes_admin123@cluster0.js2dojf.mongodb.net/Notespro?retryWrites=true&w=majority";


const connectToMongo=async ()=>{
    mongoose.connect(mongoURI,)
}

module.exports=connectToMongo

