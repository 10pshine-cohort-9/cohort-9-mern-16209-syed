import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileMenu from "../ProfileMenu";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ProfileMenu Component", () => {
  const user = {
    name: "Mustafa",
    email: "mustafa@example.com",
  };

  const mockLogout = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  test("renders user name", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Mustafa")).toBeInTheDocument();
  });

  test("renders My Account text", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("My Account")).toBeInTheDocument();
  });

  test("renders user initial in avatar", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("M")).toBeInTheDocument();
  });

  test("dropdown is closed initially", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByText("My Profile")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Logout")
    ).not.toBeInTheDocument();
  });

  test("opens dropdown when profile button is clicked", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Account/i,
      })
    );

    expect(
      screen.getByText("My Profile")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Logout/i,
      })
    ).toBeInTheDocument();
  });

  test("shows user email inside dropdown", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Account/i,
      })
    );

    expect(
      screen.getByText("mustafa@example.com")
    ).toBeInTheDocument();
  });

  test("closes dropdown when profile button is clicked again", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    const profileButton = screen.getByRole("button", {
      name: /My Account/i,
    });

    fireEvent.click(profileButton);

    expect(
      screen.getByText("My Profile")
    ).toBeInTheDocument();

    fireEvent.click(profileButton);

    expect(
      screen.queryByText("My Profile")
    ).not.toBeInTheDocument();
  });

  test("navigates to profile page when My Profile is clicked", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Account/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Profile/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/profile");

    expect(
      screen.queryByText("My Profile")
    ).not.toBeInTheDocument();
  });

  test("calls onLogout when Logout is clicked", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Account/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Logout/i,
      })
    );

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test("closes dropdown when clicking outside", () => {
    render(
      <MemoryRouter>
        <div data-testid="outside-element">
          Outside
        </div>

        <ProfileMenu
          user={user}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Account/i,
      })
    );

    expect(
      screen.getByText("My Profile")
    ).toBeInTheDocument();

    fireEvent.mouseDown(
      screen.getByTestId("outside-element")
    );

    expect(
      screen.queryByText("My Profile")
    ).not.toBeInTheDocument();
  });

  test("uses U as default initial when user is not provided", () => {
    render(
      <MemoryRouter>
        <ProfileMenu
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("U")).toBeInTheDocument();

    expect(
      screen.getByText("User")
    ).toBeInTheDocument();
  });

  test("uses default email when user email is missing", () => {
    const userWithoutEmail = {
      name: "Mustafa",
    };

    render(
      <MemoryRouter>
        <ProfileMenu
          user={userWithoutEmail}
          onLogout={mockLogout}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /My Account/i,
      })
    );

    expect(
      screen.getByText("No email available")
    ).toBeInTheDocument();
  });
});