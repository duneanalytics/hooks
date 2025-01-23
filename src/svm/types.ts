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
  next_offset?: string | null;
  errors?: {
    token_errors?: {
      address: string;
      chain_id: number;
      description?: string;
    }[];
  };
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
  /** Either 'all' or a comma separated list of chains to get balances for. Currently supports 'solana' and 'eclipse' */
  chains?: string | null;

  /** The offset to paginate through result sets. This is a cursor being passed from the previous response, only use what the backend returns here. */
  offset?: string | null;

  /** Maximum number of transactions to return */
  limit?: number | null;
};

export type TransactionsParams = {
  /** The offset to paginate through result sets. This is a cursor being passed from the previous response, only use what the backend has returned on previous responses. */
  offset?: string | null;

  /** Maximum number of transactions to return */
  limit?: number | null;
};

export type UseTokenBalancesConfig = {
  queryOptions?: {
    refetchOnWindowFocus?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  };
};

export type Transaction = {
  address: string;
  block_slot: number;
  block_time?: number | null;
  chain: "solana" | "eclipse";
  raw_transaction: any;
};

export type TransactionData = {
  transactions: Transaction[];
  next_offset?: string | null;
};
