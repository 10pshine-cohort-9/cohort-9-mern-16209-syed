import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios", () => ({
  create: jest.fn(),
}));

describe("API Configuration", () => {
  let requestSuccess;
  let requestError;
  let responseSuccess;
  let responseError;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    axios.create.mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn((success, error) => {
            requestSuccess = success;
            requestError = error;
          }),
        },

        response: {
          use: jest.fn((success, error) => {
            responseSuccess = success;
            responseError = error;
          }),
        },
      },
    });

    jest.isolateModules(() => {
      require("../api");
    });
  });

  // ---------------------------------------------
  // AXIOS CONFIGURATION
  // ---------------------------------------------

  test("creates axios instance", () => {
    expect(axios.create).toHaveBeenCalled();
  });

  test("sets default base URL", () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        timeout: 10000,
      })
    );
  });

  test("sets timeout to 10000 milliseconds", () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 10000,
      })
    );
  });

  // ---------------------------------------------
  // REQUEST INTERCEPTOR
  // ---------------------------------------------

  test("attaches JWT token to request", () => {
    localStorage.setItem(
      "token",
      "test-token"
    );

    const config = {
      headers: {},
    };

    const result = requestSuccess(config);

    expect(
      result.headers.Authorization
    ).toBe("Bearer test-token");
  });

  test("does not attach Authorization when token is missing", () => {
    const config = {
      headers: {},
    };

    const result = requestSuccess(config);

    expect(
      result.headers.Authorization
    ).toBeUndefined();
  });

  test("returns request config unchanged", () => {
    const config = {
      headers: {},
      url: "/notes",
      method: "GET",
    };

    const result = requestSuccess(config);

    expect(result).toBe(config);
  });

  test("request interceptor rejects errors", async () => {
    const error = new Error(
      "Request failed"
    );

    await expect(
      requestError(error)
    ).rejects.toBe(error);
  });

  // ---------------------------------------------
  // RESPONSE INTERCEPTOR
  // ---------------------------------------------

  test("returns successful response unchanged", () => {
    const response = {
      status: 200,
      data: {
        message: "Success",
      },
    };

    const result =
      responseSuccess(response);

    expect(result).toBe(response);
  });

  test("clears credentials when response status is 401", async () => {
    localStorage.setItem(
      "token",
      "expired-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mustafa",
      })
    );

    const error = {
      response: {
        status: 401,
      },
    };

    await expect(
      responseError(error)
    ).rejects.toBe(error);

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();
  });

  test("rejects non-401 errors", async () => {
    const error = {
      response: {
        status: 500,
      },
    };

    await expect(
      responseError(error)
    ).rejects.toBe(error);
  });

  test("rejects errors without response", async () => {
    const error = new Error(
      "Network error"
    );

    await expect(
      responseError(error)
    ).rejects.toBe(error);
  });
});