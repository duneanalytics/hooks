export type TokenBalancesParams = {
  /**
   * Either 'all' or a comma separated list of chains to get balances for.
   * Currently supports 'solana' and 'eclipse'
   */
  chains?: "all" | string[];

  /**
   * The offset to paginate through result sets. This is a cursor being passed
   * from the previous response, only use what the backend returns here.
   */
  offset?: string;

  /**
   * Maximum number of balances to return
   */
  limit?: number;
};

export type TokenBalancesData = {
  balances: TokenBalance[];
  request_time: string;
  response_time: string;
  wallet_address: string;
  next_offset?: string | null;
};

export type TokenBalance = {
  address: string;
  amount: string;
  chain: string;
  chain_id: number | null;
  decimals: number | null;
  symbol: string | null;
  price_usd: number | null;
  value_usd: number | null;
};

export type TransactionsParams = {
  /**
   * The offset to paginate through result sets. This is a cursor being passed
   * from the previous response, only use what the backend has returned here.
   */
  offset?: string;

  /**
   * Maximum number of transactions to return
   */
  limit?: number;
};

export type TransactionsData = {
  transactions: Transaction[];
  next_offset?: string | null;
};

export type Transaction = {
  address: string;
  block_slot: number;
  block_time?: number | null;
  chain: "solana" | "eclipse";
  raw_transaction: any;
};
