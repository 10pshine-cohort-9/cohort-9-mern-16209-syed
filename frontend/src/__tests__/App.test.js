import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import App from "../App";

// --------------------------------------------------
// MOCK BROWSER ROUTER
// --------------------------------------------------

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  BrowserRouter: ({ children }) => children,
}));

// --------------------------------------------------
// MOCK PAGES
// --------------------------------------------------

jest.mock("../pages/Login", () => {
  return function MockLogin() {
    return <div>LOGIN PAGE</div>;
  };
});

jest.mock("../pages/Signup", () => {
  return function MockSignup() {
    return <div>SIGNUP PAGE</div>;
  };
});

jest.mock("../pages/Dashboard", () => {
  return function MockDashboard() {
    return <div>DASHBOARD PAGE</div>;
  };
});

jest.mock("../pages/Editor", () => {
  return function MockEditor() {
    return <div>EDITOR PAGE</div>;
  };
});

jest.mock("../pages/NoteDetails", () => {
  return function MockNoteDetails() {
    return <div>NOTE DETAILS PAGE</div>;
  };
});

jest.mock("../pages/Profile", () => {
  return function MockProfile() {
    return <div>PROFILE PAGE</div>;
  };
});

// --------------------------------------------------
// TESTS
// --------------------------------------------------

describe("App Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ------------------------------------------------
  // PUBLIC ROUTES
  // ------------------------------------------------

  test("renders login page when unauthenticated user visits login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  test("renders signup page when unauthenticated user visits signup", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("SIGNUP PAGE")
    ).toBeInTheDocument();
  });

  // ------------------------------------------------
  // PROTECTED ROUTES
  // ------------------------------------------------

  test("redirects unauthenticated user from dashboard to login", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  test("redirects unauthenticated user from editor to login", () => {
    render(
      <MemoryRouter initialEntries={["/editor"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  test("redirects unauthenticated user from editor with id to login", () => {
    render(
      <MemoryRouter initialEntries={["/editor/123"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  test("redirects unauthenticated user from note details to login", () => {
    render(
      <MemoryRouter initialEntries={["/notes/123"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  test("redirects unauthenticated user from profile to login", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  // ------------------------------------------------
  // UNKNOWN ROUTE
  // ------------------------------------------------

  test("redirects unknown route to login when unauthenticated", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("LOGIN PAGE")
    ).toBeInTheDocument();
  });

  // ------------------------------------------------
  // AUTHENTICATED USER
  // ------------------------------------------------

  test("redirects authenticated user from login to dashboard", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("DASHBOARD PAGE")
    ).toBeInTheDocument();
  });

  test("redirects authenticated user from signup to dashboard", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("DASHBOARD PAGE")
    ).toBeInTheDocument();
  });

  // ------------------------------------------------
  // AUTHENTICATED PROTECTED ROUTES
  // ------------------------------------------------

  test("allows authenticated user to access dashboard", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("DASHBOARD PAGE")
    ).toBeInTheDocument();
  });

  test("allows authenticated user to access editor", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/editor"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("EDITOR PAGE")
    ).toBeInTheDocument();
  });

  test("allows authenticated user to access editor with id", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/editor/123"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("EDITOR PAGE")
    ).toBeInTheDocument();
  });

  test("allows authenticated user to access note details", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/notes/123"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("NOTE DETAILS PAGE")
    ).toBeInTheDocument();
  });

  test("allows authenticated user to access profile", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("PROFILE PAGE")
    ).toBeInTheDocument();
  });

  // ------------------------------------------------
  // AUTHENTICATED UNKNOWN ROUTE
  // ------------------------------------------------

  test("redirects authenticated user from unknown route to dashboard", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText("DASHBOARD PAGE")
    ).toBeInTheDocument();
  });
});