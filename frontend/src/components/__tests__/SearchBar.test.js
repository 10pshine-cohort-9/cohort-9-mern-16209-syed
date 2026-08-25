import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";

describe("SearchBar Component", () => {
  test("renders search input", () => {
    render(
      <SearchBar
        search=""
        setSearch={jest.fn()}
        noteCount={0}
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Search by title or content..."
      )
    ).toBeInTheDocument();
  });

  test("renders current search value", () => {
    render(
      <SearchBar
        search="React notes"
        setSearch={jest.fn()}
        noteCount={5}
      />
    );

    expect(
      screen.getByDisplayValue("React notes")
    ).toBeInTheDocument();
  });

  test("renders note count", () => {
    render(
      <SearchBar
        search=""
        setSearch={jest.fn()}
        noteCount={10}
      />
    );

    expect(
      screen.getByText("10")
    ).toBeInTheDocument();
  });

  test("calls setSearch when user types", () => {
    const mockSetSearch = jest.fn();

    render(
      <SearchBar
        search=""
        setSearch={mockSetSearch}
        noteCount={0}
      />
    );

    const input = screen.getByPlaceholderText(
      "Search by title or content..."
    );

    fireEvent.change(input, {
      target: {
        value: "JavaScript",
      },
    });

    expect(mockSetSearch).toHaveBeenCalledWith(
      "JavaScript"
    );
  });

  test("calls setSearch with updated value", () => {
    const mockSetSearch = jest.fn();

    render(
      <SearchBar
        search="React"
        setSearch={mockSetSearch}
        noteCount={3}
      />
    );

    const input = screen.getByDisplayValue("React");

    fireEvent.change(input, {
      target: {
        value: "React Notes",
      },
    });

    expect(mockSetSearch).toHaveBeenCalledTimes(1);
    expect(mockSetSearch).toHaveBeenCalledWith(
      "React Notes"
    );
  });

  test("renders zero note count", () => {
    render(
      <SearchBar
        search=""
        setSearch={jest.fn()}
        noteCount={0}
      />
    );

    expect(
      screen.getByText("0")
    ).toBeInTheDocument();
  });

  test("renders search icon", () => {
    render(
      <SearchBar
        search=""
        setSearch={jest.fn()}
        noteCount={0}
      />
    );

    expect(
      screen.getByText("🔍")
    ).toBeInTheDocument();
  });
});