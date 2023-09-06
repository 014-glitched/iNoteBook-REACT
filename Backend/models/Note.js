const mongoose = require('mongoose');
const { Schema } = mongoose;
const schema = mongoose.schema;

const NotesSchema = new Schema({
    user: { //to link notes with the associated user
        type: mongoose.Schema.Types.ObjectId, //we will give the object id of another model like a foreign key in DBMS 
        ref: 'user' //now we can store user here
    },
    title:{
        type: String,
        required: [true]
    },
    description:{
        type: String,
        required: [true]
    },
    tag:{
        type: String,
        default: 'General'
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

  module.exports = mongoose.model('notes', NotesSchema);