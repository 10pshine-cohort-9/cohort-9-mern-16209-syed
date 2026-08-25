import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import Editor from "../Editor";

import API from "../../api/api";

const mockNavigate = jest.fn();

let mockId = undefined;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    id: mockId,
  }),
}));

jest.mock("../../api/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("react-quill", () => {
  return function MockReactQuill({
    value,
    onChange,
    placeholder,
    readOnly,
  }) {
    return (
      <textarea
        data-testid="react-quill"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        readOnly={readOnly}
      />
    );
  };
});

jest.mock("../../components/Loader", () => {
  return function MockLoader({ message }) {
    return (
      <div data-testid="loader">
        {message || "Loading..."}
      </div>
    );
  };
});

jest.mock("../../components/ErrorMessage", () => {
  return function MockErrorMessage({ message }) {
    return (
      <div data-testid="error-message">
        {message}
      </div>
    );
  };
});

describe("Editor Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockId = undefined;

    API.get.mockReset();
    API.post.mockReset();
    API.put.mockReset();
    API.delete.mockReset();

    localStorage.clear();
  });

  // --------------------------------------------------
  // CREATE MODE
  // --------------------------------------------------

  test("renders create note page", () => {
    render(<Editor />);

    expect(
      screen.getByText("Create New Note")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Note Title")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter note title")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Write your note here..."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Save Note",
      })
    ).toBeInTheDocument();
  });

  test("renders back button", () => {
    render(<Editor />);

    expect(
      screen.getByRole("button", {
        name: /back/i,
      })
    ).toBeInTheDocument();
  });

  test("navigates to dashboard when back button is clicked", () => {
    render(<Editor />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /back/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  test("updates title input", () => {
    render(<Editor />);

    const titleInput =
      screen.getByPlaceholderText(
        "Enter note title"
      );

    fireEvent.change(titleInput, {
      target: {
        value: "My First Note",
      },
    });

    expect(titleInput).toHaveValue(
      "My First Note"
    );
  });

  test("updates note content", () => {
    render(<Editor />);

    const editor =
      screen.getByPlaceholderText(
        "Write your note here..."
      );

    fireEvent.change(editor, {
      target: {
        value: "<p>This is my note</p>",
      },
    });

    expect(editor).toHaveValue(
      "<p>This is my note</p>"
    );
  });

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  test("shows error when title is empty", async () => {
    render(<Editor />);

    const editor =
      screen.getByPlaceholderText(
        "Write your note here..."
      );

    fireEvent.change(editor, {
      target: {
        value: "<p>Some content</p>",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      await screen.findByText(
        "Note title is required"
      )
    ).toBeInTheDocument();

    expect(API.post).not.toHaveBeenCalled();
  });

  test("shows error when content is empty", async () => {
    render(<Editor />);

    const titleInput =
      screen.getByPlaceholderText(
        "Enter note title"
      );

    fireEvent.change(titleInput, {
      target: {
        value: "My Note",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      await screen.findByText(
        "Note content is required"
      )
    ).toBeInTheDocument();

    expect(API.post).not.toHaveBeenCalled();
  });

  test("rejects HTML containing only empty content", async () => {
    render(<Editor />);

    const titleInput =
      screen.getByPlaceholderText(
        "Enter note title"
      );

    const editor =
      screen.getByPlaceholderText(
        "Write your note here..."
      );

    fireEvent.change(titleInput, {
      target: {
        value: "My Note",
      },
    });

    fireEvent.change(editor, {
      target: {
        value: "<p></p>",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      await screen.findByText(
        "Note content is required"
      )
    ).toBeInTheDocument();

    expect(API.post).not.toHaveBeenCalled();
  });

  // --------------------------------------------------
  // CREATE NOTE
  // --------------------------------------------------

  test("creates a new note successfully", async () => {
    API.post.mockResolvedValue({
      data: {
        message: "Note created successfully",
      },
    });

    render(<Editor />);

    const titleInput =
      screen.getByPlaceholderText(
        "Enter note title"
      );

    const editor =
      screen.getByPlaceholderText(
        "Write your note here..."
      );

    fireEvent.change(titleInput, {
      target: {
        value: "  My Note  ",
      },
    });

    fireEvent.change(editor, {
      target: {
        value: "<p>My note content</p>",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith(
        "/notes",
        {
          title: "My Note",
          content: "<p>My note content</p>",
        }
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard",
      { replace: true }
    );
  });

  test("shows saving state while creating note", async () => {
    let resolveRequest;

    API.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    render(<Editor />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Enter note title"
      ),
      {
        target: {
          value: "My Note",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Write your note here..."
      ),
      {
        target: {
          value: "<p>Content</p>",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      await screen.findByRole("button", {
        name: "Saving...",
      })
    ).toBeInTheDocument();

    resolveRequest({
      data: {},
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard",
        { replace: true }
      );
    });
  });

  test("shows API error when creating note fails", async () => {
    API.post.mockRejectedValue({
      response: {
        data: {
          message: "Unable to create note",
        },
      },
    });

    render(<Editor />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Enter note title"
      ),
      {
        target: {
          value: "My Note",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Write your note here..."
      ),
      {
        target: {
          value: "<p>Content</p>",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      await screen.findByText(
        "Unable to create note"
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalledWith(
      "/dashboard",
      { replace: true }
    );
  });

  test("uses default error when create API gives no message", async () => {
    API.post.mockRejectedValue({
      response: {
        data: {},
      },
    });

    render(<Editor />);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Enter note title"
      ),
      {
        target: {
          value: "My Note",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Write your note here..."
      ),
      {
        target: {
          value: "<p>Content</p>",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      await screen.findByText(
        "Failed to save note"
      )
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // EDIT MODE
  // --------------------------------------------------

  test("loads existing note in edit mode", async () => {
    mockId = "123";

    API.get.mockResolvedValue({
      data: {
        note: {
          title: "Existing Note",
          content: "<p>Existing content</p>",
        },
      },
    });

    render(<Editor />);

    expect(
      screen.getByTestId("loader")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Existing Note")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue(
        "<p>Existing content</p>"
      )
    ).toBeInTheDocument();

    expect(API.get).toHaveBeenCalledWith(
      "/notes/123"
    );

    expect(
      screen.getByRole("button", {
        name: "Update Note",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Delete Note",
      })
    ).toBeInTheDocument();
  });

  test("loads note from data property", async () => {
    mockId = "456";

    API.get.mockResolvedValue({
      data: {
        data: {
          title: "Data Note",
          content: "<p>Data content</p>",
        },
      },
    });

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Data Note")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue(
        "<p>Data content</p>"
      )
    ).toBeInTheDocument();
  });

  test("loads note when API directly returns note data", async () => {
    mockId = "789";

    API.get.mockResolvedValue({
      data: {
        title: "Direct Note",
        content: "<p>Direct content</p>",
      },
    });

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Direct Note")
      ).toBeInTheDocument();
    });
  });

  test("shows error when existing note cannot be loaded", async () => {
    mockId = "123";

    API.get.mockRejectedValue({
      response: {
        data: {
          message: "Could not find note",
        },
      },
    });

    render(<Editor />);

    expect(
      await screen.findByText(
        "Could not find note"
      )
    ).toBeInTheDocument();
  });

  test("uses default error when loading note fails without message", async () => {
    mockId = "123";

    API.get.mockRejectedValue({
      response: {
        data: {},
      },
    });

    render(<Editor />);

    expect(
      await screen.findByText(
        "Could not load the note"
      )
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // UPDATE NOTE
  // --------------------------------------------------

  test("updates an existing note successfully", async () => {
    mockId = "123";

    API.get.mockResolvedValue({
      data: {
        note: {
          title: "Old Title",
          content: "<p>Old content</p>",
        },
      },
    });

    API.put.mockResolvedValue({
      data: {
        message: "Updated successfully",
      },
    });

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Old Title")
      ).toBeInTheDocument();
    });

    const titleInput =
      screen.getByDisplayValue("Old Title");

    fireEvent.change(titleInput, {
      target: {
        value: "Updated Title",
      },
    });

    const editor =
      screen.getByDisplayValue(
        "<p>Old content</p>"
      );

    fireEvent.change(editor, {
      target: {
        value: "<p>Updated content</p>",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Note",
      })
    );

    await waitFor(() => {
      expect(API.put).toHaveBeenCalledWith(
        "/notes/123",
        {
          title: "Updated Title",
          content: "<p>Updated content</p>",
        }
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard",
      { replace: true }
    );
  });

  // --------------------------------------------------
  // DELETE NOTE
  // --------------------------------------------------

  test("deletes note after confirmation", async () => {
    mockId = "123";

    API.get.mockResolvedValue({
      data: {
        note: {
          title: "Delete Me",
          content: "<p>Content</p>",
        },
      },
    });

    API.delete.mockResolvedValue({
      data: {},
    });

    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Delete Me")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Note",
      })
    );

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalledWith(
        "/notes/123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard",
      { replace: true }
    );

    confirmMock.mockRestore();
  });

  test("does not delete note when confirmation is cancelled", async () => {
    mockId = "123";

    API.get.mockResolvedValue({
      data: {
        note: {
          title: "Keep Me",
          content: "<p>Content</p>",
        },
      },
    });

    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(false);

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Keep Me")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Note",
      })
    );

    expect(API.delete).not.toHaveBeenCalled();

    confirmMock.mockRestore();
  });

  test("shows error when deleting note fails", async () => {
    mockId = "123";

    API.get.mockResolvedValue({
      data: {
        note: {
          title: "Delete Error",
          content: "<p>Content</p>",
        },
      },
    });

    API.delete.mockRejectedValue({
      response: {
        data: {
          message: "Unable to delete note",
        },
      },
    });

    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Delete Error")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Note",
      })
    );

    expect(
      await screen.findByText(
        "Unable to delete note"
      )
    ).toBeInTheDocument();

    confirmMock.mockRestore();
  });

  test("uses default error when delete API gives no message", async () => {
    mockId = "123";

    API.get.mockResolvedValue({
      data: {
        note: {
          title: "Delete Error",
          content: "<p>Content</p>",
        },
      },
    });

    API.delete.mockRejectedValue({
      response: {
        data: {},
      },
    });

    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    render(<Editor />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Delete Error")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Note",
      })
    );

    expect(
      await screen.findByText(
        "Failed to delete note"
      )
    ).toBeInTheDocument();

    confirmMock.mockRestore();
  });
});