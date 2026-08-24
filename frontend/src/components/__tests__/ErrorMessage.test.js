import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage Component", () => {
  test("renders the error message", () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();
  });

  test("renders different error messages correctly", () => {
    render(<ErrorMessage message="Invalid email address" />);

    expect(
      screen.getByText("Invalid email address")
    ).toBeInTheDocument();
  });

  test("has the error-message CSS class", () => {
    render(<ErrorMessage message="Error occurred" />);

    const errorMessage = screen.getByText("Error occurred");

    expect(errorMessage).toHaveClass("error-message");
  });
});