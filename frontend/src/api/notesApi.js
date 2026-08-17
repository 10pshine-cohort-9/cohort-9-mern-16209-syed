import api from "./api";

/**
 * Fetch all notes for the authenticated user.
 * Supports optional search queries or pagination filters.
 */
export const getNotes = (params = {}) => {
  return api.get("/notes", { params });
};

/**
 * Fetch a single note by ID.
 */
export const getNoteById = (id) => {
  return api.get(`/notes/${id}`);
};

/**
 * Create a new note.
 */
export const createNote = (noteData) => {
  return api.post("/notes", noteData);
};

/**
 * Update an existing note by ID.
 */
export const updateNote = (id, noteData) => {
  return api.put(`/notes/${id}`, noteData);
};

/**
 * Delete a note by ID.
 */
export const deleteNote = (id) => {
  return api.delete(`/notes/${id}`);
};