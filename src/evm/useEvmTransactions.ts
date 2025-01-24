import { useState, useEffect } from "react";

import { TransactionsParams, TransactionData, FetchError } from "./types";
import { fetchEvmTransactions } from "./duneApi";
import { useDeepMemo } from "../useDeepMemo";
import { useGetApiKey, useGetProxyUrl } from "../provider";
import { isAddress } from "viem";

export const useEvmTransactions = (
  walletAddress: string,
  params: TransactionsParams = {}
) => {
  const [state, setState] = useState<{
    data: TransactionData | null;
    error: FetchError | null;
    isLoading: boolean;
    nextOffset: string | null; // Track next_offset
    offsets: string[]; // Store offsets for each page
    currentPage: number; // Track the current page
  }>({
    data: null,
    error: null,
    isLoading: false,
    nextOffset: null, // Next offset from the API
    offsets: [], // List of offsets corresponding to pages
    currentPage: 0, // Start at the first page
  });

  const memoizedParams = useDeepMemo(() => params, [params]);
  const apiKey = useGetApiKey();
  const proxyUrl = useGetProxyUrl();

  // Function to fetch data for a specific page
  const fetchDataAsync = async (offset: string | null) => {
    if (!apiKey && !proxyUrl) {
      setState({
        data: null,
        error: new Error("One of duneApiKey or proxyUrl must be provided"),
        isLoading: false,
        nextOffset: null,
        offsets: [],
        currentPage: 0,
      });
      return;
    }

    if (!walletAddress || !isAddress(walletAddress)) {
      setState({
        data: null,
        error: new Error("walletAddress must be a valid address"),
        isLoading: false,
        nextOffset: null,
        offsets: [],
        currentPage: 0,
      });
      return;
    }

    setState((prevState) => ({ ...prevState, isLoading: true }));

    try {
      // Convert offset to number or undefined
      const updatedParams = {
        ...memoizedParams,
        offset: offset ?? undefined,
      };

      const result = await fetchEvmTransactions(
        walletAddress,
        updatedParams,
        apiKey,
        proxyUrl
      );

      setState((prevState) => ({
        ...prevState,
        data: result as TransactionData, // Type assertion
        nextOffset: result.next_offset || null,
        isLoading: false,
        offsets: offset ? [...prevState.offsets, offset] : prevState.offsets,
      }));
    } catch (err) {
      setState({
        data: null,
        error: err as FetchError,
        isLoading: false,
        nextOffset: null,
        offsets: [],
        currentPage: 0,
      });
    }
  };

  // Trigger fetch when walletAddress or params change
  useEffect(() => {
    // Fetch the first page on initial load or when walletAddress changes
    fetchDataAsync(null);
  }, [walletAddress, memoizedParams, apiKey]);

  // Function to go to the next page
  const nextPage = () => {
    if (state.nextOffset) {
      fetchDataAsync(state.nextOffset); // Fetch using the next offset
      setState((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage + 1, // Update page number
      }));
    }
  };

  // Function to go to the previous page
  const previousPage = () => {
    if (state.currentPage > 0) {
      // Use the offset corresponding to the previous page
      const previousOffset = state.offsets[state.currentPage - 1];
      fetchDataAsync(previousOffset);
      setState((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
    }
  };

  return {
    ...state,
    nextPage,
    previousPage,
  };
};

/** @deprecated */
export const useTransactions = useEvmTransactions;
