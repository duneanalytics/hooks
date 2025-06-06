import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { SimProvider } from "../../src/provider";
import { useEvmTokenBalances } from "../../src/evm/useEvmTokenBalances";
import { fetchEvmBalances } from "../../src/evm/simApi";
import { vi } from "vitest";

// Mock the Sim API
vi.mock("../../src/evm/simApi", () => ({
  fetchEvmBalances: vi.fn(),
}));

const mockFetchEvmBalances = fetchEvmBalances as jest.Mock;

// A wrapper for the hook that provides the required context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SimProvider simApiKey={process.env.SIM_API_KEY as string}>
    {children}
  </SimProvider>
);

describe("useTokenBalances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if the wallet address is not a valid address", () => {
    const { result } = renderHook(() => useEvmTokenBalances("0x123"), {
      wrapper,
    });

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

  it("should fetch token balances successfully", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const mockResponse = {
      request_time: "2025-01-16T18:09:37.116ZZ",
      response_time: "2025-01-16T18:09:37.156ZZ",
      wallet_address: walletAddress,
      balances: [
        {
          chain: "ethereum",
          chain_id: 1,
          address: "native",
          amount: "121458493673814687",
          symbol: "ETH",
          decimals: 18,
          price_usd: 3344.858473355283,
          value_usd: 406.26147172582813,
        },
      ],
    };
    mockFetchEvmBalances.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useEvmTokenBalances(walletAddress), {
      wrapper,
    });

    // Initially, `isLoading` should be true
    expect(result.current.isLoading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchEvmBalances).toHaveBeenCalledWith(
      walletAddress,
      {},
      process.env.SIM_API_KEY,
      undefined
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should handle errors when fetching token balances", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const mockError = new Error("Failed to fetch token balances");
    mockFetchEvmBalances.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useEvmTokenBalances(walletAddress), {
      wrapper,
    });

    // Initially, `isLoading` should be true
    expect(result.current.isLoading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchEvmBalances).toHaveBeenCalledWith(
      walletAddress,
      {},
      process.env.SIM_API_KEY,
      undefined
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });

  it("should not fetch data if the API key and proxy URL are missing", () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const localWrapper = ({ children }: { children: React.ReactNode }) => (
      <SimProvider simApiKey="">{children}</SimProvider>
    );

    const { result } = renderHook(() => useEvmTokenBalances(walletAddress), {
      wrapper: localWrapper,
    });

    expect(mockFetchEvmBalances).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      error: new Error("One of simApiKey or proxyUrl must be provided"),
      isLoading: false,
      nextOffset: null,
      offsets: [],
      currentPage: 0,
      nextPage: expect.any(Function),
      previousPage: expect.any(Function),
    });
  });

  it("should not fetch data if the wallet address is missing", () => {
    const { result } = renderHook(() => useEvmTokenBalances(""), { wrapper });

    expect(mockFetchEvmBalances).not.toHaveBeenCalled();
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

  it("should handle pagination: next and previous pages", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const page1Response = {
      request_time: "2025-01-16T18:09:37.116ZZ",
      response_time: "2025-01-16T18:09:37.156ZZ",
      wallet_address: walletAddress,
      next_offset: "offset1",
      balances: [
        {
          chain: "ethereum",
          chain_id: 1,
          address: "native",
          amount: "121458493673814687",
          symbol: "ETH",
          decimals: 18,
          price_usd: 3344.858473355283,
          value_usd: 406.26147172582813,
        },
      ],
    };
    const page2Response = {
      request_time: "2025-01-16T18:09:37.116ZZ",
      response_time: "2025-01-16T18:09:37.156ZZ",
      wallet_address: walletAddress,
      next_offset: "offset2",
      balances: [
        {
          chain: "base",
          chain_id: 8453,
          address: "0x0000000000000000000000000000000000000000",
          amount: "121458493673814687",
          symbol: "ETH",
          decimals: 18,
          price_usd: 3344.858473355283,
          value_usd: 406.26147172582813,
        },
      ],
    };

    mockFetchEvmBalances
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response)
      .mockResolvedValueOnce(page1Response);

    const { result } = renderHook(() => useEvmTokenBalances(walletAddress), {
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
});
