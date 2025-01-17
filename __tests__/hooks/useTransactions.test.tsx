import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { DuneProvider } from "../../src/provider";
import { useTransactions } from "../../src/useTransactions";
import { fetchTransactions } from "../../src/duneApi";
import { vi } from "vitest";

// Mock the Dune API
vi.mock("../../src/duneApi", () => ({
  fetchTransactions: vi.fn(),
}));

const mockFetchTransactions = fetchTransactions as jest.Mock;

// A wrapper for the hook that provides the required context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DuneProvider duneApiKey={process.env.DUNE_API_KEY as string}>
    {children}
  </DuneProvider>
);

describe("useTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if the wallet address is not a valid address", () => {
    const { result } = renderHook(() => useTransactions("0x123"), { wrapper });

    expect(result.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
      nextOffset: null,
      offsets: [],
      currentPage: 0,
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
    });
  });

  it("should fetch transactions successfully", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const mockResponse = {
      rrequest_time: "2025-01-16T18:09:37.116ZZ",
      response_time: "2025-01-16T18:09:37.156ZZ",
      wallet_address: walletAddress,
      transactions: [
        {
          chain: "ethereum",
          chain_id: 1,
          address: "0x1234567890abcdef1234567890abcdef12345678",
          block_time: "2025-01-15T08:00:11+00:00",
          block_number: 21628549,
          index: 187,
          hash: "0xda2c542c33c62fdf9f9a46e271e9b730086f6bf05f19e2a886079ae71a470a49",
          block_hash:
            "0x38e3851e2c21edf1d71c46ef2d28afdfc7c571b8c57b00cfe8f3d3c34ef62375",
          value: "0x3b9aca00",
          transaction_type: "Receiver",
          from: "0xf0ee8fc751a28d4f8f2716e74cf5da46e55ff437",
          to: "0x1234567890abcdef1234567890abcdef12345678",
          nonce: "0x8",
          gas_price: "0xc0dbeb5e",
          gas_used: "0x5208",
          effective_gas_price: "0xc0dbeb5e",
          success: true,
          data: "0x",
          logs: [],
        },
      ],
      next_offset: "offset1",
    };
    mockFetchTransactions.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useTransactions(walletAddress), {
      wrapper,
    });

    // Initially, `isLoading` should be true
    expect(result.current.isLoading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchTransactions).toHaveBeenCalledWith(
      walletAddress,
      { offset: undefined },
      process.env.DUNE_API_KEY
    );
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.nextOffset).toBe("offset1");
    expect(result.current.error).toBeNull();
  });

  it("should handle errors when fetching transactions", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const mockError = new Error("Failed to fetch transactions");
    mockFetchTransactions.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useTransactions(walletAddress), {
      wrapper,
    });

    // Initially, `isLoading` should be true
    expect(result.current.isLoading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchTransactions).toHaveBeenCalledWith(
      walletAddress,
      { offset: undefined },
      process.env.DUNE_API_KEY
    );
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });

  it("should handle pagination: next and previous pages", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const page1Response = {
      transactions: [
        { hash: "0x1", from: "0xabc", to: "0xdef", block_number: 123 },
      ],
      next_offset: "offset1",
    };
    const page2Response = {
      transactions: [
        { hash: "0x2", from: "0xghi", to: "0xjkl", block_number: 124 },
      ],
      next_offset: "offset2",
    };

    mockFetchTransactions
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response)
      .mockResolvedValueOnce(page1Response);

    const { result } = renderHook(() => useTransactions(walletAddress), {
      wrapper,
    });

    // Wait for the first page
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(page1Response);
    expect(result.current.currentPage).toBe(0);

    // Fetch the next page
    act(() => {
      result.current.nextPage();
    });

    // Wait for the second page
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(page2Response);
    expect(result.current.currentPage).toBe(1);

    // Fetch the previous page
    act(() => {
      result.current.previousPage();
    });

    // Wait for the first page again
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(page1Response);
    expect(result.current.currentPage).toBe(0);
  });

  it("should not fetch data if the API key is missing", () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const localWrapper = ({ children }: { children: React.ReactNode }) => (
      <DuneProvider duneApiKey="">{children}</DuneProvider>
    );

    const { result } = renderHook(() => useTransactions(walletAddress), {
      wrapper: localWrapper,
    });

    expect(mockFetchTransactions).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
      nextOffset: null,
      offsets: [],
      currentPage: 0,
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
    });
  });

  it("should not fetch data if the wallet address is missing", () => {
    const { result } = renderHook(() => useTransactions(""), { wrapper });

    expect(mockFetchTransactions).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
      nextOffset: null,
      offsets: [],
      currentPage: 0,
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
    });
  });
});
