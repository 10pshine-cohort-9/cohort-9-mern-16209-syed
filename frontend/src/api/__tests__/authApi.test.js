import "@testing-library/jest-dom";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../authApi";

import api from "../api";

jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("authApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // ---------------------------------------------
  // REGISTER
  // ---------------------------------------------

  test("registerUser calls register API", () => {
    const userData = {
      name: "Mustafa",
      email: "mustafa@example.com",
      password: "password123",
    };

    registerUser(userData);

    expect(api.post).toHaveBeenCalledWith(
      "/auth/register",
      userData
    );
  });

  test("registerUser returns API response", async () => {
    const response = {
      data: {
        token: "test-token",
        user: {
          name: "Mustafa",
        },
      },
    };

    api.post.mockResolvedValue(response);

    const result = await registerUser({
      name: "Mustafa",
      email: "mustafa@example.com",
      password: "password123",
    });

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // LOGIN
  // ---------------------------------------------

  test("loginUser calls login API", () => {
    const userData = {
      email: "mustafa@example.com",
      password: "password123",
    };

    loginUser(userData);

    expect(api.post).toHaveBeenCalledWith(
      "/auth/login",
      userData
    );
  });

  test("loginUser returns API response", async () => {
    const response = {
      data: {
        token: "login-token",
        user: {
          name: "Mustafa",
        },
      },
    };

    api.post.mockResolvedValue(response);

    const result = await loginUser({
      email: "mustafa@example.com",
      password: "password123",
    });

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // CURRENT USER
  // ---------------------------------------------

  test("getCurrentUser calls auth me API", () => {
    getCurrentUser();

    expect(api.get).toHaveBeenCalledWith(
      "/auth/me"
    );
  });

  test("getCurrentUser returns API response", async () => {
    const response = {
      data: {
        user: {
          name: "Mustafa",
          email: "mustafa@example.com",
        },
      },
    };

    api.get.mockResolvedValue(response);

    const result = await getCurrentUser();

    expect(result).toBe(response);
  });

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------

  test("logoutUser removes token from localStorage", () => {
    localStorage.setItem(
      "token",
      "test-token"
    );

    logoutUser();

    expect(
      localStorage.getItem("token")
    ).toBeNull();
  });

  test("logoutUser removes user from localStorage", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
        email: "mustafa@example.com",
      })
    );

    logoutUser();

    expect(
      localStorage.getItem("user")
    ).toBeNull();
  });

  test("logoutUser removes both token and user", () => {
    localStorage.setItem(
      "token",
      "test-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
      })
    );

    logoutUser();

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();
  });
});