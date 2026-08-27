import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Signup from "../Signup";

import api from "../../api/api";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../api/api", () => ({
  post: jest.fn(),
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

describe("Signup Component", () => {
  const setAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    api.post.mockReset();
  });

  // ---------------------------------------------
  // RENDERING
  // ---------------------------------------------

  test("renders signup page", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Notes Manager")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Create Account",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create an account to save and organize your notes."
      )
    ).toBeInTheDocument();
  });

  test("renders all signup inputs", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText("Full Name")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email Address")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();
  });

  test("renders create account button", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: "Create Account",
      })
    ).toBeInTheDocument();
  });

  test("renders login link", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole("link", {
      name: "Log In",
    });

    expect(loginLink).toBeInTheDocument();

    expect(loginLink).toHaveAttribute(
      "href",
      "/login"
    );
  });

  // ---------------------------------------------
  // INPUTS
  // ---------------------------------------------

  test("updates name input", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    const input =
      screen.getByLabelText("Full Name");

    fireEvent.change(input, {
      target: {
        value: "Mustafa Hussain",
      },
    });

    expect(input).toHaveValue(
      "Mustafa Hussain"
    );
  });

  test("updates email input", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    const input =
      screen.getByLabelText("Email Address");

    fireEvent.change(input, {
      target: {
        value: "test@example.com",
      },
    });

    expect(input).toHaveValue(
      "test@example.com"
    );
  });

  test("updates password input", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    const input =
      screen.getByLabelText("Password");

    fireEvent.change(input, {
      target: {
        value: "password123",
      },
    });

    expect(input).toHaveValue(
      "password123"
    );
  });

  // ---------------------------------------------
  // API REQUEST
  // ---------------------------------------------

  test("calls register API with trimmed and lowercase data", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "test-token",
        user: {
          name: "Mustafa Hussain",
          email: "test@example.com",
        },
      },
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "  Mustafa Hussain  ",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: " TEST@EXAMPLE.COM ",
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
        name: "Create Account",
      })
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/auth/register",
        {
          name: "Mustafa Hussain",
          email: "test@example.com",
          password: "password123",
        }
      );
    });
  });

  // ---------------------------------------------
  // SUCCESS
  // ---------------------------------------------

  test("successfully creates account", async () => {
    const user = {
      name: "Mustafa Hussain",
      email: "test@example.com",
    };

    api.post.mockResolvedValue({
      data: {
        token: "test-token",
        user,
      },
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa Hussain",
        },
      }
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
        name: "Create Account",
      })
    );

    await waitFor(() => {
      expect(
        setAuth
      ).toHaveBeenCalledWith(true);
    });

    expect(
      localStorage.getItem("token")
    ).toBe("test-token");

    expect(
      JSON.parse(
        localStorage.getItem("user")
      )
    ).toEqual(user);

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/dashboard",
      {
        replace: true,
      }
    );
  });

  test("handles nested API response data", async () => {
    const user = {
      name: "Mustafa",
      email: "mustafa@example.com",
    };

    api.post.mockResolvedValue({
      data: {
        data: {
          token: "nested-token",
          user,
        },
      },
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "mustafa@example.com",
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
        name: "Create Account",
      })
    );

    await waitFor(() => {
      expect(
        setAuth
      ).toHaveBeenCalledWith(true);
    });

    expect(
      localStorage.getItem("token")
    ).toBe("nested-token");

    expect(
      JSON.parse(
        localStorage.getItem("user")
      )
    ).toEqual(user);
  });

  test("stores token even when user is not returned", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "test-token",
      },
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email Address"),
      {
        target: {
          value: "mustafa@example.com",
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
        name: "Create Account",
      })
    );

    await waitFor(() => {
      expect(
        setAuth
      ).toHaveBeenCalledWith(true);
    });

    expect(
      localStorage.getItem("token")
    ).toBe("test-token");

    expect(
      localStorage.getItem("user")
    ).toBeNull();

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/dashboard",
      {
        replace: true,
      }
    );
  });

  // ---------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------

  test("shows API error message", async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
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
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText(
        "Email already exists"
      )
    ).toBeInTheDocument();

    expect(
      setAuth
    ).not.toHaveBeenCalled();

    expect(
      mockNavigate
    ).not.toHaveBeenCalled();
  });

  test("shows normal Error message", async () => {
    api.post.mockRejectedValue(
      new Error("Network error")
    );

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
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
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText("Network error")
    ).toBeInTheDocument();
  });

  test("shows default error when no error message exists", async () => {
    api.post.mockRejectedValue({
      response: {
        data: {},
      },
      message: "",
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
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
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText(
        "Unable to create your account. Please try again."
      )
    ).toBeInTheDocument();
  });

  test("shows error when token is missing", async () => {
    api.post.mockResolvedValue({
      data: {
        user: {
          name: "Mustafa",
          email: "test@example.com",
        },
      },
    });

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
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
        name: "Create Account",
      })
    );

    expect(
      await screen.findByText(
        "Account was created, but no authentication token was received."
      )
    ).toBeInTheDocument();

    expect(
      setAuth
    ).not.toHaveBeenCalled();

    expect(
      mockNavigate
    ).not.toHaveBeenCalled();
  });

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  test("shows loading state while signup request is pending", async () => {
    let resolveSignup;

    api.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignup = resolve;
        })
    );

    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Mustafa",
        },
      }
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
        name: "Create Account",
      })
    );

    expect(
      await screen.findByRole("button", {
        name: "Creating Account...",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Full Name")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Email Address")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Password")
    ).toBeDisabled();

    resolveSignup({
      data: {
        token: "test-token",
        user: {
          name: "Mustafa",
        },
      },
    });

    await waitFor(() => {
      expect(
        setAuth
      ).toHaveBeenCalledWith(true);
    });
  });

  // ---------------------------------------------
  // INPUT ATTRIBUTES
  // ---------------------------------------------

  test("has correct input types", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText("Full Name")
    ).toHaveAttribute("type", "text");

    expect(
      screen.getByLabelText("Email Address")
    ).toHaveAttribute("type", "email");

    expect(
      screen.getByLabelText("Password")
    ).toHaveAttribute("type", "password");
  });

  test("password requires minimum 6 characters", () => {
    render(
      <MemoryRouter>
        <Signup setAuth={setAuth} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText("Password")
    ).toHaveAttribute("minLength", "6");
  });
});