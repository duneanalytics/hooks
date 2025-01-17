import { useState, useEffect } from "react";

import { TokenBalancesParams, BalanceData, FetchError } from "./types";
import { fetchSvmBalances } from "./duneApi";
import { useDeepMemo } from "../useDeepMemo";
import { useGetApiKey } from "../provider";

export const useSvmTokenBalances = (
  walletAddress: string,
  params: TokenBalancesParams = {}
) => {
  const [state, setState] = useState<{
    data: BalanceData | null;
    error: FetchError | null;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: false,
  });

  const memoizedParams = useDeepMemo(() => params, params);
  const apiKey = useGetApiKey();

  useEffect(() => {
    if (!apiKey) return;
    const fetchDataAsync = async () => {
      if (!walletAddress) return;

      setState((prevState) => ({ ...prevState, isLoading: true }));

      try {
        const result = await fetchSvmBalances(
          walletAddress,
          memoizedParams,
          apiKey
        );
        setState({
          data: result,
          error: null,
          isLoading: false,
        });
      } catch (err) {
        setState({
          data: null,
          error: err as FetchError,
          isLoading: false,
        });
      }
    };

    fetchDataAsync();
  }, [walletAddress, memoizedParams, apiKey]);

  return state;
};
