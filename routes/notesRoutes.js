const express = require(
  "express"
);

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} = require(
  "../controllers/notesController"
);


router
  .route("/")
  .get(
    protect,
    getNotes
  )
  .post(
    protect,
    createNote
  );

router
  .route("/:id")
  .get(
    protect,
    getNoteById
  )
  .put(
    protect,
    updateNote
  )
  .delete(
    protect,
    deleteNote
  );

module.exports = router;