import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { DuneProvider } from "../../src/provider";
import { useSvmTokenBalances } from "../../src/svm/useSvmTokenBalances";
import { fetchSvmBalances } from "../../src/svm/duneApi";
import { vi } from "vitest";

// Mock the Dune API
vi.mock("../../src/svm/duneApi", () => ({
  fetchSvmBalances: vi.fn(),
}));

const mockFetchSvmBalances = fetchSvmBalances as jest.Mock;

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

    mockFetchSvmBalances.mockResolvedValueOnce(mockResponse);

    const { result: svmResult } = renderHook(
      () => useSvmTokenBalances(walletAddress),
      {
        wrapper,
      }
    );

    // Initially, `isLoading` should be true
    expect(svmResult.current.isLoading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(svmResult.current.isLoading).toBe(false);
    });

    expect(mockFetchSvmBalances).toHaveBeenCalledWith(
      walletAddress,
      {},
      process.env.DUNE_API_KEY
    );
    expect(svmResult.current.isLoading).toBe(false);
    expect(svmResult.current.error).toBeNull();
    expect(svmResult.current.data).toEqual(mockResponse);
  });

  it("should handle errors when fetching token balances", async () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const mockError = new Error("Failed to fetch token balances");

    mockFetchSvmBalances.mockRejectedValueOnce(mockError);

    const { result: svmResult } = renderHook(
      () => useSvmTokenBalances(walletAddress),
      {
        wrapper,
      }
    );

    // Initially, `isLoading` should be true
    expect(svmResult.current.isLoading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(svmResult.current.isLoading).toBe(false);
    });

    expect(mockFetchSvmBalances).toHaveBeenCalledWith(
      walletAddress,
      {},
      process.env.DUNE_API_KEY
    );
    expect(svmResult.current.isLoading).toBe(false);
    expect(svmResult.current.error).toEqual(mockError);
    expect(svmResult.current.data).toBeNull();
  });

  it("should not fetch data if the API key is missing", () => {
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const localWrapper = ({ children }: { children: React.ReactNode }) => (
      <DuneProvider duneApiKey="">{children}</DuneProvider>
    );

    const { result: svmResult } = renderHook(
      () => useSvmTokenBalances(walletAddress),
      {
        wrapper: localWrapper,
      }
    );

    expect(mockFetchSvmBalances).not.toHaveBeenCalled();
    expect(svmResult.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
    });
  });

  it("should not fetch data if the wallet address is missing", () => {
    const { result: svmResult } = renderHook(() => useSvmTokenBalances(""), {
      wrapper,
    });

    expect(mockFetchSvmBalances).not.toHaveBeenCalled();
    expect(svmResult.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
    });
  });
});
