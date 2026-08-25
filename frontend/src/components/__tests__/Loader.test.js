import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import Loader from "../Loader";

describe("Loader Component", () => {
  test("renders loading message", () => {
    render(<Loader />);

    expect(
      screen.getByText("Loading your notes...")
    ).toBeInTheDocument();
  });

  test("has the loading-text CSS class", () => {
    render(<Loader />);

    const loader = screen.getByText("Loading your notes...");

    expect(loader).toHaveClass("loading-text");
  });
});