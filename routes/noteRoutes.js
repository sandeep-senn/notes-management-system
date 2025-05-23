import express from "express";
import {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  updateNotePinned,
  searchNote,
} from "../controller/noteController.js";

import requireAuth from "../utils/authMiddleware.js"; // ✅ only this import

const noteRouter = express.Router();

noteRouter.post("/add", requireAuth, addNote);
noteRouter.post("/edit/:noteId", requireAuth, editNote);
noteRouter.get("/all", requireAuth, getAllNotes);
noteRouter.delete("/delete/:noteId", requireAuth, deleteNote);
noteRouter.put("/update-note-pinned/:noteId", updateNotePinned);
noteRouter.get("/search", requireAuth, searchNote);

export default noteRouter;
