import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Dashboard from "../Dashboard";

import {
  getNotes,
  deleteNote,
} from "../../api/notesApi";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../api/notesApi", () => ({
  getNotes: jest.fn(),
  deleteNote: jest.fn(),
}));

/*
  Mock child components.

  Dashboard itself is what we are testing,
  so we keep the child components simple.
*/

jest.mock("../../components/Navbar", () => {
  return function MockNavbar({ user, onLogout }) {
    return (
      <div data-testid="navbar">
        <span>{user?.name || "No User"}</span>

        <button onClick={onLogout}>
          Logout
        </button>
      </div>
    );
  };
});

jest.mock("../../components/DashboardHeader", () => {
  return function MockDashboardHeader() {
    return <div>Dashboard Header</div>;
  };
});

jest.mock("../../components/SearchBar", () => {
  return function MockSearchBar({
    search,
    setSearch,
    noteCount,
  }) {
    return (
      <div>
        <input
          placeholder="Search notes"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <span>{noteCount}</span>
      </div>
    );
  };
});

jest.mock("../../components/NoteCard", () => {
  return function MockNoteCard({
    note,
    onDelete,
  }) {
    const noteId = note._id || note.id;

    return (
      <div data-testid="note-card">
        <h3>{note.title}</h3>

        <button
          onClick={() => onDelete(noteId)}
        >
          Delete {note.title}
        </button>
      </div>
    );
  };
});

jest.mock("../../components/EmptyState", () => {
  return function MockEmptyState({
    title,
    message,
    showButton,
    buttonText,
    onButtonClick,
  }) {
    return (
      <div data-testid="empty-state">
        <h3>{title}</h3>
        <p>{message}</p>

        {showButton && (
          <button onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    );
  };
});

jest.mock("../../components/Loader", () => {
  return function MockLoader() {
    return (
      <div data-testid="loader">
        Loading your notes...
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

describe("Dashboard Component", () => {
  const setAuth = jest.fn();

  const notes = [
    {
      _id: "1",
      title: "React Notes",
      content: "<p>Learning React</p>",
      createdAt: "2026-08-10T10:00:00.000Z",
    },
    {
      _id: "2",
      title: "JavaScript Notes",
      content: "<p>Learning JavaScript</p>",
      createdAt: "2026-08-11T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.clear();

    getNotes.mockResolvedValue({
      data: notes,
    });

    deleteNote.mockResolvedValue({
      data: {},
    });
  });

  test("renders loading state initially", () => {
    getNotes.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("loader")
    ).toBeInTheDocument();
  });

  test("loads and displays notes successfully", async () => {
    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("JavaScript Notes")
    ).toBeInTheDocument();

    expect(getNotes).toHaveBeenCalledTimes(1);
  });

  test("displays correct note count", async () => {
    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("2 notes saved")
      ).toBeInTheDocument();
    });
  });

  test("shows empty state when there are no notes", async () => {
    getNotes.mockResolvedValue({
      data: [],
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No notes yet")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Start organizing your ideas by creating your first note."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create First Note",
      })
    ).toBeInTheDocument();
  });

  test("navigates to editor from empty state", async () => {
    getNotes.mockResolvedValue({
      data: [],
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Create First Note",
        })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create First Note",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/editor"
    );
  });

  test("filters notes using search text", async () => {
    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    const searchInput =
      screen.getByPlaceholderText("Search notes");

    fireEvent.change(searchInput, {
      target: {
        value: "react",
      },
    });

    expect(
      screen.getByText("React Notes")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("JavaScript Notes")
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("1 note found")
    ).toBeInTheDocument();
  });

  test("searches note content", async () => {
    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    const searchInput =
      screen.getByPlaceholderText("Search notes");

    fireEvent.change(searchInput, {
      target: {
        value: "javascript",
      },
    });

    expect(
      screen.getByText("JavaScript Notes")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("React Notes")
    ).not.toBeInTheDocument();
  });

  test("shows no matching notes state", async () => {
    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    const searchInput =
      screen.getByPlaceholderText("Search notes");

    fireEvent.change(searchInput, {
      target: {
        value: "xyz123",
      },
    });

    expect(
      screen.getByText("No matching notes")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Try another search keyword."
      )
    ).toBeInTheDocument();
  });

  test("displays error when getNotes fails", async () => {
    getNotes.mockRejectedValue({
      response: {
        status: 500,
        data: {
          message: "Server error",
        },
      },
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("error-message")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Server error")
    ).toBeInTheDocument();
  });

  test("uses default error message when API gives no message", async () => {
    getNotes.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load notes.")
      ).toBeInTheDocument();
    });
  });

  test("logs out when getNotes returns 401", async () => {
    localStorage.setItem(
      "token",
      "test-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
      })
    );

    getNotes.mockRejectedValue({
      response: {
        status: 401,
      },
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(setAuth).toHaveBeenCalledWith(false);
    });

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith(
      "/login",
      { replace: true }
    );
  });

  test("logs out when getNotes returns 403", async () => {
    getNotes.mockRejectedValue({
      response: {
        status: 403,
      },
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(setAuth).toHaveBeenCalledWith(false);
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/login",
      { replace: true }
    );
  });

  test("loads saved user from localStorage", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
        email: "mustafa@example.com",
      })
    );

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Mustafa")
      ).toBeInTheDocument();
    });
  });

  test("removes invalid user data from localStorage", async () => {
    localStorage.setItem(
      "user",
      "invalid-json"
    );

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        localStorage.getItem("user")
      ).toBeNull();
    });

    consoleError.mockRestore();
  });

  test("deletes note after confirmation", async () => {
    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete React Notes",
      })
    );

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(
        screen.queryByText("React Notes")
      ).not.toBeInTheDocument();
    });

    confirmMock.mockRestore();
  });

  test("does not delete note when confirmation is cancelled", async () => {
    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(false);

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete React Notes",
      })
    );

    expect(deleteNote).not.toHaveBeenCalled();

    expect(
      screen.getByText("React Notes")
    ).toBeInTheDocument();

    confirmMock.mockRestore();
  });

  test("shows alert when deleting note fails", async () => {
    deleteNote.mockRejectedValue({
      response: {
        data: {
          message: "Unable to delete note",
        },
      },
    });

    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    const alertMock = jest
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("React Notes")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete React Notes",
      })
    );

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Unable to delete note"
      );
    });

    confirmMock.mockRestore();
    alertMock.mockRestore();
  });

  test("handles API response containing notes property", async () => {
    getNotes.mockResolvedValue({
      data: {
        notes: [
          {
            _id: "3",
            title: "Notes Property",
            content: "<p>Test</p>",
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Notes Property")
      ).toBeInTheDocument();
    });
  });

  test("handles API response containing data property", async () => {
    getNotes.mockResolvedValue({
      data: {
        data: [
          {
            _id: "4",
            title: "Data Property",
            content: "<p>Test</p>",
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Data Property")
      ).toBeInTheDocument();
    });
  });
});