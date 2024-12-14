import { useEffect, useState } from "react";
import { useDuneClient } from "../provider";
import { useDeepMemo } from "../useDeepMemo";
import { fetchTokenBalances } from "./api";
import { TokenBalancesData, TokenBalancesParams } from "./types";

export const useTokenBalances = (
  walletAddress: string,
  params?: TokenBalancesParams
) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    data: TokenBalancesData | null;
    error: Error | null;
  }>({
    isLoading: true,
    data: null,
    error: null,
  });

  const memoizedParams = useDeepMemo(() => params, params);
  const client = useDuneClient();

  useEffect(() => {
    const fetchDataAsync = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));

      try {
        const result = await fetchTokenBalances(
          client,
          walletAddress,
          memoizedParams
        );

        setState({
          isLoading: false,
          data: result,
          error: null,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        setState({
          isLoading: false,
          data: null,
          error,
        });
      }
    };

    fetchDataAsync();
  }, [client, walletAddress, memoizedParams]);

  return state;
};
