import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmptyState from "../EmptyState";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("EmptyState Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders icon, title, and message", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("📝")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No Notes" })).toBeInTheDocument();
    expect(
      screen.getByText("You don't have any notes yet.")
    ).toBeInTheDocument();
  });

  test("does not render button when showButton is false", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={false}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("button")
    ).not.toBeInTheDocument();
  });

  test("renders button when showButton is true", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={true}
          buttonText="Create Note"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Create Note" })
    ).toBeInTheDocument();
  });

  test("uses custom button text", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={true}
          buttonText="Add New Note"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Add New Note" })
    ).toBeInTheDocument();
  });

  test("uses default button text when buttonText is not provided", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={true}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Create First Note" })
    ).toBeInTheDocument();
  });

  test("calls onButtonClick when provided", () => {
    const mockButtonClick = jest.fn();

    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={true}
          buttonText="Create Note"
          onButtonClick={mockButtonClick}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Create Note" })
    );

    expect(mockButtonClick).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("navigates to editor when onButtonClick is not provided", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon="📝"
          title="No Notes"
          message="You don't have any notes yet."
          showButton={true}
          buttonText="Create Note"
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Create Note" })
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/editor");
  });
});