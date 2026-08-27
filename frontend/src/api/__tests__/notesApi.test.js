import "@testing-library/jest-dom";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../notesApi";

import api from "../api";

jest.mock("../api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("notesApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------
  // GET ALL NOTES
  // ---------------------------------------------

  test("getNotes calls notes API", () => {
    getNotes();

    expect(api.get).toHaveBeenCalledWith(
      "/notes",
      {
        params: {},
      }
    );
  });

  test("getNotes sends query parameters", () => {
    const params = {
      search: "javascript",
      page: 1,
      limit: 10,
    };

    getNotes(params);

    expect(api.get).toHaveBeenCalledWith(
      "/notes",
      {
        params,
      }
    );
  });

  test("getNotes returns API response", async () => {
    const response = {
      data: {
        notes: [
          {
            _id: "1",
            title: "Test Note",
          },
        ],
      },
    };

    api.get.mockResolvedValue(response);

    const result = await getNotes();

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // GET SINGLE NOTE
  // ---------------------------------------------

  test("getNoteById calls correct endpoint", () => {
    getNoteById("123");

    expect(api.get).toHaveBeenCalledWith(
      "/notes/123"
    );
  });

  test("getNoteById returns API response", async () => {
    const response = {
      data: {
        note: {
          _id: "123",
          title: "My Note",
        },
      },
    };

    api.get.mockResolvedValue(response);

    const result = await getNoteById("123");

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // CREATE NOTE
  // ---------------------------------------------

  test("createNote calls create endpoint", () => {
    const noteData = {
      title: "New Note",
      content: "<p>Note content</p>",
    };

    createNote(noteData);

    expect(api.post).toHaveBeenCalledWith(
      "/notes",
      noteData
    );
  });

  test("createNote returns API response", async () => {
    const response = {
      data: {
        note: {
          _id: "123",
          title: "New Note",
        },
      },
    };

    api.post.mockResolvedValue(response);

    const result = await createNote({
      title: "New Note",
      content: "Content",
    });

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // UPDATE NOTE
  // ---------------------------------------------

  test("updateNote calls correct endpoint", () => {
    const noteData = {
      title: "Updated Note",
      content: "<p>Updated content</p>",
    };

    updateNote("123", noteData);

    expect(api.put).toHaveBeenCalledWith(
      "/notes/123",
      noteData
    );
  });

  test("updateNote returns API response", async () => {
    const response = {
      data: {
        note: {
          _id: "123",
          title: "Updated Note",
        },
      },
    };

    api.put.mockResolvedValue(response);

    const result = await updateNote(
      "123",
      {
        title: "Updated Note",
        content: "Updated content",
      }
    );

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // DELETE NOTE
  // ---------------------------------------------

  test("deleteNote calls correct endpoint", () => {
    deleteNote("123");

    expect(api.delete).toHaveBeenCalledWith(
      "/notes/123"
    );
  });

  test("deleteNote returns API response", async () => {
    const response = {
      data: {
        message: "Note deleted successfully",
      },
    };

    api.delete.mockResolvedValue(response);

    const result = await deleteNote("123");

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // DIFFERENT ID TYPES
  // ---------------------------------------------

  test("getNoteById works with numeric ID", () => {
    getNoteById(123);

    expect(api.get).toHaveBeenCalledWith(
      "/notes/123"
    );
  });

  test("deleteNote works with numeric ID", () => {
    deleteNote(456);

    expect(api.delete).toHaveBeenCalledWith(
      "/notes/456"
    );
  });
});