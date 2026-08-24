import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "../NoteCard";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("NoteCard Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const note = {
    _id: "123",
    title: "My First Note",
    content: "<p>This is my note content.</p>",
    createdAt: "2026-08-10T10:00:00.000Z",
  };

  test("renders note title", () => {
    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={(content) =>
            content.replace(/<[^>]+>/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "My First Note",
      })
    ).toBeInTheDocument();
  });

  test("renders note content", () => {
    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={(content) =>
            content.replace(/<[^>]+>/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("This is my note content.")
    ).toBeInTheDocument();
  });

  test("renders NOTE label", () => {
    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={(content) =>
            content.replace(/<[^>]+>/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("NOTE")).toBeInTheDocument();
  });

  test("renders formatted creation date", () => {
    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={(content) =>
            content.replace(/<[^>]+>/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    const expectedDate = new Date(
      note.createdAt
    ).toLocaleDateString("en-GB");

    expect(
      screen.getByText(`Created: ${expectedDate}`)
    ).toBeInTheDocument();
  });

  test("renders Untitled Note when title is missing", () => {
    const noteWithoutTitle = {
      ...note,
      title: "",
    };

    render(
      <MemoryRouter>
        <NoteCard
          note={noteWithoutTitle}
          getPlainText={(content) =>
            content.replace(/<[^>]+>/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "Untitled Note",
      })
    ).toBeInTheDocument();
  });

  test("renders Unknown when createdAt is missing", () => {
    const noteWithoutDate = {
      ...note,
      createdAt: undefined,
    };

    render(
      <MemoryRouter>
        <NoteCard
          note={noteWithoutDate}
          getPlainText={(content) =>
            content.replace(/<[^>]+>/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Created: Unknown")
    ).toBeInTheDocument();
  });

  test("renders No content when content is missing", () => {
    const noteWithoutContent = {
      ...note,
      content: "",
    };

    render(
      <MemoryRouter>
        <NoteCard
          note={noteWithoutContent}
          getPlainText={(content) =>
            content.replace(/<[^>]+/g, "")
          }
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No content")
    ).toBeInTheDocument();
  });

  test("does not render View Details for a short note", () => {
    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={() => "Short note"}
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("button", {
        name: /view details/i,
      })
    ).not.toBeInTheDocument();
  });

  test("renders View Details for a long note", () => {
    const longText = "A".repeat(101);

    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={() => longText}
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /view details/i,
      })
    ).toBeInTheDocument();
  });

  test("navigates to note details when View Details is clicked", () => {
    const longText = "A".repeat(101);

    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={() => longText}
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /view details/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/notes/123"
    );
  });

  test("navigates to editor when Edit is clicked", () => {
    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={() => "Short note"}
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/editor/123"
    );
  });

  test("calls onDelete with note id when Delete is clicked", () => {
    const mockDelete = jest.fn();

    render(
      <MemoryRouter>
        <NoteCard
          note={note}
          getPlainText={() => "Short note"}
          onDelete={mockDelete}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith("123");
  });

  test("uses note.id when _id is not available", () => {
    const noteWithId = {
      ...note,
      _id: undefined,
      id: "456",
    };

    render(
      <MemoryRouter>
        <NoteCard
          note={noteWithId}
          getPlainText={() => "Short note"}
          onDelete={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/editor/456"
    );
  });
});