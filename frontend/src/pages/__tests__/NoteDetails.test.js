import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import NoteDetails from "../NoteDetails";

import api from "../../api/api";

const mockNavigate = jest.fn();

let mockId = "123";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    id: mockId,
  }),
}));

jest.mock("../../api/api", () => ({
  get: jest.fn(),
}));

jest.mock("../../components/Loader", () => {
  return function MockLoader({ message }) {
    return (
      <div data-testid="loader">
        {message}
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

describe("NoteDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockId = "123";
    api.get.mockReset();
  });

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  test("shows loading state while fetching note", () => {
    api.get.mockReturnValue(
      new Promise(() => {})
    );

    render(<NoteDetails />);

    expect(
      screen.getByText("Loading note details...")
    ).toBeInTheDocument();
  });

  // ---------------------------------------------
  // SUCCESSFUL NOTE
  // ---------------------------------------------

  test("renders note details successfully", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          _id: "123",
          title: "My Important Note",
          content: "<p>This is my note content.</p>",
          createdAt: "2026-08-10T10:00:00.000Z",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("My Important Note")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("NOTE DETAILS")
    ).toBeInTheDocument();

    expect(
      screen.getByText("This is my note content.")
    ).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith(
      "/notes/123"
    );
  });

  test("renders note from data property", async () => {
    api.get.mockResolvedValue({
      data: {
        data: {
          _id: "123",
          title: "Data Property Note",
          content: "<p>Data property content</p>",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Data Property Note")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Data property content")
    ).toBeInTheDocument();
  });

  test("renders note when API directly returns note data", async () => {
    api.get.mockResolvedValue({
      data: {
        _id: "123",
        title: "Direct Note",
        content: "<p>Direct content</p>",
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Direct Note")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Direct content")
    ).toBeInTheDocument();
  });

  // ---------------------------------------------
  // DEFAULT VALUES
  // ---------------------------------------------

  test("shows Untitled Note when title is missing", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          _id: "123",
          content: "<p>Some content</p>",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Untitled Note")
      ).toBeInTheDocument();
    });
  });

  test("shows Unknown when createdAt is missing", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          _id: "123",
          title: "No Date Note",
          content: "<p>Content</p>",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Created: Unknown")
      ).toBeInTheDocument();
    });
  });

  test("shows default content when note content is missing", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          _id: "123",
          title: "Empty Content",
          content: "",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Empty Content")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("No content available.")
    ).toBeInTheDocument();
  });

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  test("shows API error message", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Note could not be found",
        },
      },
    });

    render(<NoteDetails />);

    expect(
      await screen.findByText(
        "Note could not be found"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /back to dashboard/i,
      })
    ).toBeInTheDocument();
  });

  test("shows default error message when API gives no message", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {},
      },
    });

    render(<NoteDetails />);

    expect(
      await screen.findByText(
        "Unable to load this note."
      )
    ).toBeInTheDocument();
  });

  // ---------------------------------------------
  // NOTE NOT FOUND
  // ---------------------------------------------

  test("shows Note Not Found when API returns null note", async () => {
    api.get.mockResolvedValue({
      data: {
        note: null,
        data: null,
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Note Not Found")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "The note you are looking for does not exist or was removed."
      )
    ).toBeInTheDocument();
  });

  // ---------------------------------------------
  // NAVIGATION
  // ---------------------------------------------

  test("back button navigates to dashboard", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          _id: "123",
          title: "Test Note",
          content: "<p>Content</p>",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Test Note")
      ).toBeInTheDocument();
    });

    const backButtons =
      screen.getAllByRole("button", {
        name: /back/i,
      });

    fireEvent.click(backButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  test("error page back button navigates to dashboard", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Server error",
        },
      },
    });

    render(<NoteDetails />);

    const button =
      await screen.findByRole("button", {
        name: /back to dashboard/i,
      });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  test("not found page back button navigates to dashboard", async () => {
    api.get.mockResolvedValue({
      data: {
        note: null,
        data: null,
      },
    });

    render(<NoteDetails />);

    const button =
      await screen.findByRole("button", {
        name: /back to dashboard/i,
      });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  // ---------------------------------------------
  // EDIT
  // ---------------------------------------------

  test("Edit Note button navigates to editor", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          _id: "123",
          title: "Editable Note",
          content: "<p>Edit this</p>",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Editable Note")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit Note",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/editor/123"
    );
  });

  test("uses id when _id is not available", async () => {
    api.get.mockResolvedValue({
      data: {
        note: {
          id: "456",
          title: "ID Note",
          content: "<p>Content</p>",
        },
      },
    });

    render(<NoteDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("ID Note")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit Note",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/editor/456"
    );
  });
});