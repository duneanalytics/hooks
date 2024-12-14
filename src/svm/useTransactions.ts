import { useCallback, useEffect, useState } from "react";
import { useDuneClient } from "../provider";
import { useDeepMemo } from "../useDeepMemo";
import { fetchTransactions } from "./api";
import { TransactionsData, TransactionsParams } from "./types";

export const useTransactions = (
  walletAddress: string,
  params?: TransactionsParams
) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    data: TransactionsData | null;
    error: Error | null;
    nextOffset: string | null; // Track next_offset
    offsets: string[]; // Store offsets for each page
    currentPage: number; // Track the current page
  }>({
    isLoading: true,
    data: null,
    error: null,
    nextOffset: null, // Next offset from the API
    offsets: [], // List of offsets corresponding to pages
    currentPage: 0, // Start at the first page
  });

  const memoizedParams = useDeepMemo(() => params, [params]);
  const client = useDuneClient();

  // Function to fetch data for a specific page
  const fetchDataAsync = useCallback(
    async (offset: string | null) => {
      if (!walletAddress) return;

      setState((prevState) => ({ ...prevState, isLoading: true }));

      try {
        // Convert offset to number or undefined
        const updatedParams = {
          ...memoizedParams,
          offset: offset ?? undefined,
        };
        const result = await fetchTransactions(
          client,
          walletAddress,
          updatedParams
        );

        setState((prevState) => ({
          ...prevState,
          data: result,
          nextOffset: result.next_offset || null,
          isLoading: false,
          offsets: offset ? [...prevState.offsets, offset] : prevState.offsets,
        }));
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        setState({
          data: null,
          error,
          isLoading: false,
          nextOffset: null,
          offsets: [],
          currentPage: 0,
        });
      }
    },
    [client, walletAddress, memoizedParams]
  );

  // Trigger fetch when walletAddress or params change
  useEffect(() => {
    // Fetch the first page on initial load or when walletAddress changes
    fetchDataAsync(null);
  }, [fetchDataAsync]);

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
