import React from "react";
import { render, screen } from "@testing-library/react";
import Particles from "./particles";

describe("Particles Component Unit Tests", () => {
  let mockGetContext;

  beforeEach(() => {
    mockGetContext = jest.fn(() => ({
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      closePath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
    }));
    HTMLCanvasElement.prototype.getContext = mockGetContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders canvas element with proper class and attributes", () => {
    render(<Particles types={["Fire"]} isAnimationFinished={false} />);
    const canvas = screen.getByTestId("type-particles");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass("type-particles-canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  test("initializes canvas context and animation loop for single and dual types", () => {
    const { unmount } = render(
      <Particles types={["Grass", "Poison"]} isAnimationFinished={false} />
    );
    expect(mockGetContext).toHaveBeenCalledWith("2d");
    unmount();
  });

  test("handles empty or missing types gracefully", () => {
    const { container } = render(<Particles types={[]} isAnimationFinished={false} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  test("handles isAnimationFinished change without throwing errors", () => {
    const { rerender } = render(
      <Particles types={["Water", "Flying"]} isAnimationFinished={false} />
    );
    expect(screen.getByTestId("type-particles")).toBeInTheDocument();

    rerender(<Particles types={["Water", "Flying"]} isAnimationFinished={true} />);
    expect(screen.getByTestId("type-particles")).toBeInTheDocument();
  });

  test("cleans up on unmount", () => {
    const cancelSpy = jest.spyOn(window, "cancelAnimationFrame");
    const removeListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<Particles types={["Electric"]} isAnimationFinished={false} />);
    unmount();

    expect(cancelSpy).toHaveBeenCalled();
    expect(removeListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    cancelSpy.mockRestore();
    removeListenerSpy.mockRestore();
  });
});
