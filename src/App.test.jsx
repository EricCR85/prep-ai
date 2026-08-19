import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

test("renders app without crashing", () => {
  const { container } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  expect(container).toBeTruthy();

});
