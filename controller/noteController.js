import errorHandler from "../utils/errorHandler.js";
import Note from "../models/note.model.js";

export const addNote = async (req, res) => {
  console.log("Adding note for user:", req.auth.userId);
  const { title, content, tags } = req.body;
  const userId = req.auth.userId;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  if (!content) {
    return res.status(400).json({ success: false, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.userId,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// export const addNote = async (req, res) => {
//   try {
//     const { title, content, tags } = req.body;
//     const userId = req.auth?.userId;       
//     console.log("req.auth:", req.auth);

//     if (!userId) {  
//       return res.status(400).json({ message: "Missing userId" });
//     }

//     console.log("Saving note:", { title, content, tags, userId });

//     const note = new Note({
//       title,
//       content,
//       tags,
//       userId,
//     });

//     await note.save();

//     res.status(200).json({ success: true, note });
//   } catch (error) {
//     console.log("0000")
//     console.error("Error saving note:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const editNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    if (req.auth.userId !== note.userId) {
      return res.status(401).json({ success: false, message: "You can only update your own note!" });
    }


    const { title, content, tags, isPinned } = req.body;

    if (!title && !content && !tags && isPinned === undefined) {
      return res.status(400).json({ success: false, message: "No changes provided" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const getAllNotes = async (req, res) => {
    console.log("getAllNotes route hit");  // Check if this prints in terminal
const userId = req.auth.userId;
  try {
const notes = await Note.find({ userId }).sort({ isPinned: -1 });
    res.status(200).json({
      success: true,
      message: "All notes retrieved successfully",
      notes,
    });
  } catch (error) {
    console.error("Error in getAllNotes:", error); // <---- Add this line
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};


export const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;

  try {
   const note = await Note.findOne({ _id: noteId, userId: req.auth.userId });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

await Note.deleteOne({ _id: noteId, userId: req.auth.userId });
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const updateNotePinned = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found!" });
    }

    if (req.auth.userId !== note.userId.toString()) {
      return res.status(401).json({ success: false, message: "You can only update your own note!" });
    }

    const { isPinned } = req.body;

    if (typeof isPinned !== "boolean") {
      return res.status(400).json({ success: false, message: "Invalid isPinned value" });
    }

    note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};


export const searchNote = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: req.auth.userId,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};
