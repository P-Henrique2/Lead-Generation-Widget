import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WidgetChat } from "./widget-chat";

const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockClearError = vi.fn();
const mockAddToolResult = vi.fn();

const useChatMock = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useChat: () => useChatMock(),
}));

describe("WidgetChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendMessage.mockReset();
    mockStop.mockReset();
    mockClearError.mockReset();
    mockAddToolResult.mockReset();
  });

  it("renders user and assistant text messages", () => {
    useChatMock.mockReturnValue({
      messages: [
        { id: "1", role: "user", content: "Help me qualify this lead" },
        { id: "2", role: "assistant", content: "I can help with that." },
      ],
      status: "ready",
      error: undefined,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      clearError: mockClearError,
      stop: mockStop,
    });

    render(<WidgetChat />);

    expect(screen.getByText("Help me qualify this lead")).toBeInTheDocument();
    expect(screen.getByText("I can help with that.")).toBeInTheDocument();
  });

  it("shows a thinking indicator while status is streaming", () => {
    useChatMock.mockReturnValue({
      messages: [{ id: "1", role: "user", content: "Tell me more" }],
      status: "streaming",
      error: undefined,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      clearError: mockClearError,
      stop: mockStop,
    });

    render(<WidgetChat />);

    expect(screen.getByText("Thinking…")).toBeInTheDocument();
  });

  it("renders a pending tool score state", () => {
    useChatMock.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreLead",
              toolCallId: "call-1",
              state: "input-streaming",
              input: { teamSize: "6-20", timeline: "this month", isDecisionMaker: true },
            },
          ],
        },
      ],
      status: "streaming",
      error: undefined,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      clearError: mockClearError,
      stop: mockStop,
    });

    render(<WidgetChat />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("No data yet.")).toBeInTheDocument();
  });

  it("renders an output-available score tool state", () => {
    useChatMock.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreLead",
              toolCallId: "call-2",
              state: "output-available",
              input: { teamSize: "6-20", timeline: "this month", isDecisionMaker: true },
              output: { score: 90, tier: "hot", reasoning: "Strong fit" },
            },
          ],
        },
      ],
      status: "ready",
      error: undefined,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      clearError: mockClearError,
      stop: mockStop,
    });

    render(<WidgetChat />);

    expect(screen.getByText("Lead fit score")).toBeInTheDocument();
    expect(screen.getByText("90/100")).toBeInTheDocument();
    expect(screen.getByText("HOT")).toBeInTheDocument();
    expect(screen.getByText("Strong fit")).toBeInTheDocument();
  });

  it("renders an output-error state without dumping the raw error", () => {
    useChatMock.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreLead",
              toolCallId: "call-3",
              state: "output-error",
              errorText: "This failed",
            },
          ],
        },
      ],
      status: "ready",
      error: undefined,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      clearError: mockClearError,
      stop: mockStop,
    });

    render(<WidgetChat />);

    expect(screen.getByText(/we couldn’t complete the lead score right now/i)).toBeInTheDocument();
    expect(screen.queryByText("This failed")).not.toBeInTheDocument();
  });

  it("renders the top-level error state and retries the last user message", async () => {
    const user = userEvent.setup();
    useChatMock.mockReturnValue({
      messages: [{ id: "1", role: "user", content: "My team is 6-20" }],
      status: "error",
      error: new Error("boom"),
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      clearError: mockClearError,
      stop: mockStop,
    });

    render(<WidgetChat />);

    await user.type(screen.getByLabelText(/message/i), "My team is 6-20");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/message failed/i);
    const retryButton = await screen.findByRole("button", { name: /retry/i });
    await user.click(retryButton);

    expect(mockSendMessage).toHaveBeenCalledWith({ text: "My team is 6-20" });
  });
});
