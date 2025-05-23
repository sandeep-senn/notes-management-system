import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    isPinned:{
        type: Boolean,
        default: false,
    },
    content:{
        type: String,
        required: true,
    },
    tags:{
        type:[String],
        default : [],
    },
    userId:{
        type:String,
        required: false,

    }
})

const Note = mongoose.model("Note", noteSchema)
export default Note