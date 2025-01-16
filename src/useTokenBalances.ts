import { isAddress } from "viem";
import { TokenBalancesParams, BalanceData, FetchError } from "./types";
import { fetchBalances } from "./duneApi";
import { useState, useEffect } from "react";
import { useDeepMemo } from "./useDeepMemo";
import { useGetApiKey } from "./provider";

export const useTokenBalances = (
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
      if (!walletAddress || !isAddress(walletAddress)) return;

      setState((prevState) => ({ ...prevState, isLoading: true }));

      try {
        const result = await fetchBalances(
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
