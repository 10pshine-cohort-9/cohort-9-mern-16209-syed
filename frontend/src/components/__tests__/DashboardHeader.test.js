import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardHeader from "../DashboardHeader";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("DashboardHeader Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders dashboard label", () => {
    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders heading", () => {
    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    expect(screen.getByText("Your Notes")).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /Create, organize, and manage your notes effortlessly/i
      )
    ).toBeInTheDocument();
  });

  test("renders New Note button", () => {
    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /new note/i,
      })
    ).toBeInTheDocument();
  });

  test("navigates to editor page on button click", () => {
    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /new note/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/editor");
  });
});