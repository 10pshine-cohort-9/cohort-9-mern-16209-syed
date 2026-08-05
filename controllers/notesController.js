const Note = require(
  "../models/Note"
);


exports.getNotes = async (
  req,
  res,
  next
) => {
  try {
    const notes =
      await Note.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      notes: notes,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE

exports.createNote = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      content,
    } = req.body;

    if (
      !title ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title and content are required.",
      });
    }

    const note =
      await Note.create({
        title,
        content,

        // Automatically assign note
        // to logged-in user
        user: req.user._id,
      });

    res.status(201).json({
      success: true,
      message:
        "Note created successfully.",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// GET ONE USER'S NOTE


exports.getNoteById = async (
  req,
  res,
  next
) => {
  try {
    const note =
      await Note.findOne({
        _id: req.params.id,

        // Only owner can access
        user: req.user._id,
      });

    if (!note) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found.",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE 

exports.updateNote = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      content,
    } = req.body;

    const note =
      await Note.findOneAndUpdate(
        {
          _id:
            req.params.id,

          // Only note owner can update
          user:
            req.user._id,
        },
        {
          title,
          content,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!note) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found or access denied.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Note updated successfully.",
      note,
    });
  } catch (error) {
    next(error);
  }
};
// DELETE
exports.deleteNote = async (
  req,
  res,
  next
) => {
  try {
    const note =
      await Note.findOneAndDelete({
        _id:
          req.params.id,

        // Only note owner can delete
        user:
          req.user._id,
      });

    if (!note) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found or access denied.",
      });
    }
    res.status(200).json({
      success: true,
      message:
        "Note deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};