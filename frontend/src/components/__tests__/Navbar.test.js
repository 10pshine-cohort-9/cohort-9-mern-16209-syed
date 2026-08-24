import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

// Mock ProfileMenu so we can test Navbar independently
jest.mock("../ProfileMenu", () => {
  return function MockProfileMenu({ user, onLogout }) {
    return (
      <div data-testid="profile-menu">
        <span>{user.name}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  };
});

describe("Navbar Component", () => {
  const mockUser = {
    name: "Mustafa",
    email: "mustafa@example.com",
  };

  const mockLogout = jest.fn();

  beforeEach(() => {
    mockLogout.mockClear();
  });

  test("renders Notes Manager title", () => {
    render(
      <Navbar
        user={mockUser}
        onLogout={mockLogout}
      />
    );

    expect(
      screen.getByText("Notes Manager")
    ).toBeInTheDocument();
  });

  test("renders application tagline", () => {
    render(
      <Navbar
        user={mockUser}
        onLogout={mockLogout}
      />
    );

    expect(
      screen.getByText(
        "Organize your work and ideas efficiently"
      )
    ).toBeInTheDocument();
  });

  test("renders logo", () => {
    render(
      <Navbar
        user={mockUser}
        onLogout={mockLogout}
      />
    );

    expect(screen.getByText("N")).toBeInTheDocument();
  });

  test("renders ProfileMenu", () => {
    render(
      <Navbar
        user={mockUser}
        onLogout={mockLogout}
      />
    );

    expect(
      screen.getByTestId("profile-menu")
    ).toBeInTheDocument();
  });

  test("passes user to ProfileMenu", () => {
    render(
      <Navbar
        user={mockUser}
        onLogout={mockLogout}
      />
    );

    expect(
      screen.getByText("Mustafa")
    ).toBeInTheDocument();
  });

  test("passes onLogout to ProfileMenu", () => {
    render(
      <Navbar
        user={mockUser}
        onLogout={mockLogout}
      />
    );

    screen.getByRole("button", {
      name: "Logout",
    }).click();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});