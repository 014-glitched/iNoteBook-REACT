const mongoose = require('mongoose');

const NotesSchema = new Schema({
    title:{
        trype: String,
        required: true
    },
    description:{
        trype: String,
        required: true
    },
    tag:{
        trype: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

  module.exports = mongoose.model('notes', NotesSchema);