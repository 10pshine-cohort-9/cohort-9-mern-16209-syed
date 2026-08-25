import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Login from "../Login";

import { loginUser } from "../../api/authApi";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../api/authApi", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../../components/ErrorMessage", () => {
  return function MockErrorMessage({ message }) {
    return (
      <div data-testid="error-message">
        {message}
      </div>
    );
  };
});

describe("Login Component", () => {
  const setAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    loginUser.mockReset();
  });

  test("renders login page", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Notes Manager")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Welcome Back")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Sign in to access and manage your personal notes."
      )
    ).toBeInTheDocument();
  });

  test("renders email and password inputs", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText("Email Address")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();
  });

  test("renders login button", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: "Log In",
      })
    ).toBeInTheDocument();
  });

  test("renders signup link", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    const signupLink = screen.getByRole("link", {
      name: "Sign Up",
    });

    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  test("updates email input", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    const emailInput =
      screen.getByLabelText("Email Address");

    fireEvent.change(emailInput, {
      target: {
        value: "test@example.com",
      },
    });

    expect(emailInput).toHaveValue(
      "test@example.com"
    );
  });

  test("updates password input", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    const passwordInput =
      screen.getByLabelText("Password");

    fireEvent.change(passwordInput, {
      target: {
        value: "password123",
      },
    });

    expect(passwordInput).toHaveValue(
      "password123"
    );
  });

  test("calls loginUser with email and password", async () => {
    loginUser.mockResolvedValue({
      data: {
        token: "test-token",
        user: {
          name: "Mustafa",
          email: "test@example.com",
        },
      },
    });

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("successfully logs in user", async () => {
    const user = {
      name: "Mustafa",
      email: "test@example.com",
    };

    loginUser.mockResolvedValue({
      data: {
        token: "test-token",
        user,
      },
    });

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    await waitFor(() => {
      expect(setAuth).toHaveBeenCalledWith(true);
    });

    expect(
      localStorage.getItem("token")
    ).toBe("test-token");

    expect(
      JSON.parse(localStorage.getItem("user"))
    ).toEqual(user);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard",
      { replace: true }
    );
  });

  test("handles nested response data", async () => {
    const user = {
      name: "Mustafa",
      email: "test@example.com",
    };

    loginUser.mockResolvedValue({
      data: {
        data: {
          token: "nested-token",
          user,
        },
      },
    });

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    await waitFor(() => {
      expect(setAuth).toHaveBeenCalledWith(true);
    });

    expect(
      localStorage.getItem("token")
    ).toBe("nested-token");

    expect(
      JSON.parse(localStorage.getItem("user"))
    ).toEqual(user);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard",
      { replace: true }
    );
  });

  test("shows API error message", async () => {
    loginUser.mockRejectedValue({
      response: {
        data: {
          message: "Invalid email or password",
        },
      },
    });

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "wrong@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "wrongpassword",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    expect(
      await screen.findByText(
        "Invalid email or password"
      )
    ).toBeInTheDocument();

    expect(setAuth).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error from normal Error object", async () => {
    loginUser.mockRejectedValue(
      new Error("Network connection failed")
    );

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    expect(
      await screen.findByText(
        "Network connection failed"
      )
    ).toBeInTheDocument();
  });

  test("shows default error when API provides no message", async () => {
    loginUser.mockRejectedValue({
      response: {
        data: {},
      },
      message: "",
    });

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    expect(
      await screen.findByText(
        "Unable to log in. Please try again."
      )
    ).toBeInTheDocument();
  });

  test("shows error when API returns no authorization token", async () => {
    loginUser.mockResolvedValue({
      data: {
        user: {
          name: "Mustafa",
        },
      },
    });

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    expect(
      await screen.findByText(
        "No authorization token returned from server."
      )
    ).toBeInTheDocument();

    expect(setAuth).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows loading state while login request is pending", async () => {
    let resolveLogin;

    loginUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );

    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "test@example.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    expect(
      await screen.findByRole("button", {
        name: "Logging in...",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email Address")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Password")
    ).toBeDisabled();

    resolveLogin({
      data: {
        token: "test-token",
        user: {
          name: "Mustafa",
        },
      },
    });

    await waitFor(() => {
      expect(setAuth).toHaveBeenCalledWith(true);
    });
  });

  test("does not submit with invalid email", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "invalid-email",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Log In",
      })
    );

    expect(loginUser).not.toHaveBeenCalled();
  });

  test("inputs have correct types", () => {
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText("Email Address")
    ).toHaveAttribute("type", "email");

    expect(
      screen.getByLabelText("Password")
    ).toHaveAttribute("type", "password");
  });
});