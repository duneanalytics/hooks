// Use 'type' for simple type aliases
type TokenBalance = {
    chain: string;
    chain_id: number;
    address: string;
    amount: string;
    symbol?: string;
    decimals?: number;
    price_usd?: number;
    value_usd?: number;
  };
  
  export type BalanceData = {
    request_time: string;
    response_time: string;
    wallet_address: string;
    balances: TokenBalance[];
  };
  
  export type FetchError = Error & {
    status?: number;
    info?: unknown;
  };
  
  export type ResponseData = {
    data?: BalanceData;
    error?: FetchError;
    isLoading: boolean;
  };
  
  export type TokenBalancesParams = {
    /** Specify this to get native balances for a long tail of EVM chains, where we don't support ERC20 assets */
    allChains?: boolean;
    /** Comma separated list of chain ids to get balances for */
    chainIds?: string;
    /** Specify this to exclude spam tokens from the response */
    excludeSpamTokens?: boolean;
    /** Specify `erc20` or `native` to get only ERC20 tokens or native assets, respectively */
    filters?: "erc20" | "native";
    /** Maximum number of transactions to return */
    limit?: number;
    /** The offset to paginate through result sets. This is a cursor being passed from the previous response, only use what the backend returns here. */
    offset?: number;
  };
  
  export type UseTokenBalancesConfig = {
    queryOptions?: {
      refetchOnWindowFocus?: boolean;
      staleTime?: number;
      refetchInterval?: number;
    }
  };

export type Transaction = {
  // Add fields that represent a single transaction
  // This is an example, adjust according to your actual data structure
  hash: string;
  from: string;
  to: string;
  value: string;
  // ... other transaction fields
};

export type TransactionData = {
  request_time: string;
  response_time: string;
  wallet_address: string;
  transactions: Transaction[];
  next_offset?: string | null;
};
