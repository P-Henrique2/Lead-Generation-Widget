import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SettingsPage from "./page";

describe("SettingsPage", () => {
  it("shows a required-title validation error", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: /save widget settings/i }));

    const titleInput = screen.getByLabelText(/widget title/i);
    expect(titleInput).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Title is required")).toBeInTheDocument();
  });

  it("rejects invalid accent color values", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const titleInput = screen.getByLabelText(/widget title/i);
    await user.type(titleInput, "Flowstate");

    const accentInput = screen.getByLabelText(/accent color/i);
    await user.clear(accentInput);
    await user.type(accentInput, "#12");
    await user.click(screen.getByRole("button", { name: /save widget settings/i }));

    expect(screen.getByText("Enter a valid hex color, e.g. #06b6d4")).toBeInTheDocument();
    expect(accentInput).toHaveAttribute("aria-invalid", "true");
  });

  it("blocks submission when all capture fields are disabled", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const titleInput = screen.getByLabelText(/widget title/i);
    await user.type(titleInput, "Flowstate");

    const accentInput = screen.getByLabelText(/accent color/i);
    await user.clear(accentInput);
    await user.type(accentInput, "#06b6d4");

    const toggles = screen.getAllByRole("switch");
    for (const toggle of toggles) {
      await user.click(toggle);
    }

    await user.click(screen.getByRole("button", { name: /save widget settings/i }));

    expect(screen.getByText(/at least one capture field must stay enabled/i)).toBeInTheDocument();
  });

  it("submits successfully with valid values", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<SettingsPage />);

    const titleInput = screen.getByLabelText(/widget title/i);
    await user.type(titleInput, "Flowstate");

    const accentInput = screen.getByLabelText(/accent color/i);
    await user.clear(accentInput);
    await user.type(accentInput, "#06b6d4");

    await user.click(screen.getByRole("button", { name: /save widget settings/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Widget config saved:",
        expect.objectContaining({
          title: "Flowstate",
          accentColor: "#06b6d4",
          captureFields: expect.objectContaining({
            name: true,
            email: true,
            message: true,
          }),
        }),
      );
    });

    expect(screen.getByText(/widget settings saved successfully/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
