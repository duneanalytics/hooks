import {
    TokenBalancesParams,
    BalanceData,
    FetchError,
  } from "./types";
  import { fetchTransactions } from "./duneApi";
  import { useState, useEffect } from "react";
  import { useDeepMemo } from "./useDeepMemo";
  import { useGetApiKey } from "./provider";
  
  export const useTransactions = (
    walletAddress: string,
    params: TokenBalancesParams
  ) => {
    const [state, setState] = useState<{
      data: BalanceData | null;
      error: FetchError | null;
      isLoading: boolean;
      nextOffset: string | null;  // Track next_offset
      offsets: string[];          // Store offsets for each page
      currentPage: number;        // Track the current page
    }>({
      data: null,
      error: null,
      isLoading: false,
      nextOffset: null,    // Next offset from the API
      offsets: [],         // List of offsets corresponding to pages
      currentPage: 0,      // Start at the first page
    });
  
    const memoizedParams = useDeepMemo(() => params, [params]);
    const apiKey = useGetApiKey();
  
    // Function to fetch data for a specific page
    const fetchDataAsync = async (offset: string | null) => {
      if (!walletAddress) return;
  
      setState(prevState => ({ ...prevState, isLoading: true }));
  
      try {
        // Include offset in the API request if it's available
        const updatedParams = { ...memoizedParams, offset };
        const result = await fetchTransactions(walletAddress, updatedParams, apiKey);
  
        setState(prevState => ({
          ...prevState,
          data: result,
          nextOffset: result.next_offset || null,  // Store the next_offset for pagination
          isLoading: false,
          // If there's a new offset, append it to the list for pagination
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
        fetchDataAsync(state.nextOffset);  // Fetch using the next offset
        setState(prevState => ({
          ...prevState,
          currentPage: prevState.currentPage + 1,  // Update page number
        }));
      }
    };
  
    // Function to go to the previous page
    const previousPage = () => {
      if (state.currentPage > 0) {
        // Use the offset corresponding to the previous page
        const previousOffset = state.offsets[state.currentPage - 1];
        fetchDataAsync(previousOffset);
        setState(prevState => ({
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