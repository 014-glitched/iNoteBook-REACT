const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get all the Notes using GET: "/api/notes/getuser". Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }); //we will get all the notes from the id logged in
        res.json(notes);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});

//ROUTE 2: Add a new Note using POST: "/api/notes/addnote". Login required

router.post("/addnote", fetchuser,[
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({ min: 5,}),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      //if there are no errors then we will save new notes
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();      //it will return note
      res.json(savedNote);                      //savedNote will be send as the reponse
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
  }
);

//ROUTE 3: Update an existing Note using PUT: "/api/notes/updatenote". Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const {title, description, tag} = req.body;
  try {
    //Create newNote object
  const newNote = {};                   //if title coming as part of the request then we will add it in this object
  if(title){newNote.title = title};     //if title present then newNotes title will be equalled to the title
  if(description){newNote.description = description};
  if(tag){newNote.tag = tag};           //we wont give user the functionality of updating the date

  //Find the note to be updated and update it
  let note = await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not Found")};  //if note not found then send this

  if(note.user.toString() !== req.user.id){       //it means the user which is logged in is trying to access someone else's notes
    return res.status(401).send("Not Allowed");
  } //note.user.toString() it will give the id of the note

  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote} , {new:true})
  // {new:true} it means that if new contact came then it will be created and hence our note will be updated 
  res.json({note});
  }
  
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});

//ROUTE 4: Delete an existing Note using DELETE: "/api/notes/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
                                           //Here we need to verify the person which is deleting the note is his note only
  try {
    //Find the note to be deleted and delete it
  let note = await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not Found")};  //if note not found then send this

  //Allow deletion only if user owns this note
  if(note.user.toString() !== req.user.id){       //it means the user which is logged in is trying to access someone else's notes
    return res.status(401).send("Not Allowed");   //note.user.toString() it will give the id of the note
  } 
  note = await Note.findByIdAndDelete(req.params.id)
  
  res.json({"Success": "Note has been deleted", note : note});

  } 
  
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});
module.exports = router;
