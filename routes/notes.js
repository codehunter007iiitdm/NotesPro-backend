const express=require('express')
const router=express.Router();
const fetchuser=require('../middleware/fetchuser')
const Notes=require('../models/notes')
const {body,validationResult}=require('express-validator') 

// Route to get all the notes.GET "/notes/fetchallnotes". (LOGIN REQUIRED)
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    const notes=await Notes.find({user:req.user})
    res.json(notes)
})

//Route to add notes. POST "/notes/addnotes". (LOGIN REQUIRED)

router.post('/addnotes',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min:5}),
],async (req,res)=>{
    const {title,description,tag}=req.body;
    const result = validationResult(req);
    if(!result.isEmpty()){
     return res.status(400).json({errors:errors.array()})
   }
    try {
        const note=new Notes({
            title,description,tag,user:req.user
        })
        const saveNote=await note.save()
    
        res.json(saveNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
    
})


// ROUTE TO UPDATE EXISTING NOTES. PUT "/notes/updatenotes" LOGIN REQUIRED
router.put('/updatenotes/:id',fetchuser,async (req,res)=>{
    const {title,description,tag}=req.body;
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};


    //Find the note
    let note= await Notes.findById(req.params.id);
    if(!note){ return res.status(404).send("Notes not found")}
    //Check the user
    if(note.user.toString()!==req.user){return res.status(401).send("Not allowed to update")}
    //update 
    note=await  Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note})

})

// ROUTE TO DELETE EXISTING NOTES. DELETE "/notes/deletenotes" LOGIN REQUIRED
router.delete('/deletenotes/:id',fetchuser,async (req,res)=>{
    //Find the note
    let note= await Notes.findById(req.params.id);
    if(!note){ return res.status(404).send("Notes not found")}
    //Check the user
    if(note.user.toString()!==req.user){return res.status(401).send("Not allowed to delete")}
    //update 
    note=await  Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Notes has been deleted"})

})

module.exports=router
