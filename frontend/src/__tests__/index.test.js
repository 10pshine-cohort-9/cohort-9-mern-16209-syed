import "@testing-library/jest-dom";

const mockRender = jest.fn();

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
  })),
}));

jest.mock("../App", () => {
  return function MockApp() {
    return <div>Mock App</div>;
  };
});

describe("index.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    document.body.innerHTML =
      '<div id="root"></div>';
  });

  test("creates root and renders App", async () => {
    await import("../index");

    const ReactDOM = require("react-dom/client");

    expect(
      ReactDOM.createRoot
    ).toHaveBeenCalledWith(
      document.getElementById("root")
    );

    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});