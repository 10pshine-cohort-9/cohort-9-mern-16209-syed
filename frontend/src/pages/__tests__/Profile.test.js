import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Profile from "../Profile";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Profile Component", () => {
  const setAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // ---------------------------------------------
  // RENDERING
  // ---------------------------------------------

  test("renders profile page", () => {
    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "My Profile",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("View your account information")
    ).toBeInTheDocument();
  });

  test("renders default user information when no user is stored", () => {
    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("User")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Notes Manager User")
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Not available")
    ).toHaveLength(2);

    expect(
      screen.getByText("U")
    ).toBeInTheDocument();
  });

  test("renders stored user information", async () => {
    const user = {
      name: "Mustafa",
      email: "mustafa@example.com",
    };

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getAllByText("Mustafa")
      ).toHaveLength(2);
    });

    expect(
      screen.getByText("mustafa@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText("M")
    ).toBeInTheDocument();
  });

  // ---------------------------------------------
  // USER INITIAL
  // ---------------------------------------------

  test("shows first letter of user name as avatar", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "John",
        email: "john@example.com",
      })
    );

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("J")
      ).toBeInTheDocument();
    });
  });

  test("trims user name before creating avatar initial", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "   Mustafa",
        email: "mustafa@example.com",
      })
    );

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("M")
      ).toBeInTheDocument();
    });
  });

  // ---------------------------------------------
  // NAVIGATION
  // ---------------------------------------------

  test("back button navigates to dashboard", () => {
    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /back to dashboard/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  test("dashboard button navigates to dashboard", () => {
    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Dashboard",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------

  test("logout removes token and user from localStorage", () => {
    localStorage.setItem(
      "token",
      "test-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
        email: "mustafa@example.com",
      })
    );

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout",
      })
    );

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();
  });

  test("logout sets authentication to false", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
        email: "mustafa@example.com",
      })
    );

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout",
      })
    );

    expect(
      setAuth
    ).toHaveBeenCalledWith(false);
  });

  test("logout navigates to login page", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
        email: "mustafa@example.com",
      })
    );

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout",
      })
    );

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/login",
      { replace: true }
    );
  });

  // ---------------------------------------------
  // INVALID LOCAL STORAGE
  // ---------------------------------------------

  test("handles invalid stored user data", async () => {
    localStorage.setItem(
      "user",
      "invalid-json"
    );

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        localStorage.getItem("user")
      ).toBeNull();
    });

    expect(
      screen.getByText("User")
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  // ---------------------------------------------
  // BUTTONS
  // ---------------------------------------------

  test("renders Dashboard and Logout buttons", () => {
    render(
      <MemoryRouter>
        <Profile setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Logout",
      })
    ).toBeInTheDocument();
  });
});