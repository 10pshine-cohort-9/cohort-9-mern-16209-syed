const { expect } = require("chai");
const errorHandler = require("../middleware/errorHandler");
const logger = require("../config/logger");

describe("Error Handler Middleware", () => {
  let originalError;
  let res;

  beforeEach(() => {
    originalError = logger.error;

    // Prevent actual logger output during tests
    logger.error = () => {};

    res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function (data) {
        this.responseData = data;
        return this;
      },
    };
  });

  afterEach(() => {
    logger.error = originalError;
    delete process.env.NODE_ENV;
  });

  it("should return custom status and error message", () => {
    const err = {
      status: 400,
      message: "Bad Request",
      stack: "Test stack",
    };

    process.env.NODE_ENV = "production";

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).to.equal(400);
    expect(res.responseData.success).to.equal(false);
    expect(res.responseData.message).to.equal("Bad Request");
    expect(res.responseData.stack).to.equal(undefined);
  });

  it("should return 500 and default message when status and message are missing", () => {
    const err = {};

    process.env.NODE_ENV = "production";

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).to.equal(500);
    expect(res.responseData.success).to.equal(false);
    expect(res.responseData.message).to.equal("Internal Server Error");
    expect(res.responseData.stack).to.equal(undefined);
  });

  it("should include stack trace in development mode", () => {
    const err = {
      status: 500,
      message: "Test Error",
      stack: "Error: Test Error\n    at test",
    };

    process.env.NODE_ENV = "development";

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).to.equal(500);
    expect(res.responseData.success).to.equal(false);
    expect(res.responseData.message).to.equal("Test Error");
    expect(res.responseData.stack).to.equal(err.stack);
  });
});