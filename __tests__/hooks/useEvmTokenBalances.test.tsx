import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { DuneProvider } from "../../src/provider";
import { useEvmTokenBalances } from "../../src/evm/useEvmTokenBalances";
import { fetchEvmBalances } from "../../src/evm/duneApi";
import { vi } from "vitest";

// Mock the Dune API
vi.mock("../../src/evm/duneApi", () => ({
  fetchEvmBalances: vi.fn(),
}));

const mockFetchEvmBalances = fetchEvmBalances as jest.Mock;

// A wrapper for the hook that provides the required context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DuneProvider duneApiKey={process.env.DUNE_API_KEY as string}>
    {children}
  </DuneProvider>
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
      process.env.DUNE_API_KEY
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
      process.env.DUNE_API_KEY
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });

  it("should not fetch data if the API key is missing", () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const localWrapper = ({ children }: { children: React.ReactNode }) => (
      <DuneProvider duneApiKey="">{children}</DuneProvider>
    );

    const { result } = renderHook(() => useEvmTokenBalances(walletAddress), {
      wrapper: localWrapper,
    });

    expect(mockFetchEvmBalances).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
    });
  });

  it("should not fetch data if the wallet address is missing", () => {
    const { result } = renderHook(() => useEvmTokenBalances(""), { wrapper });

    expect(mockFetchEvmBalances).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
    });
  });
});
