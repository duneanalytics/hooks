export type TokenBalancesParams = {
  /** Comma separated list of chain ids to get balances for */
  chain_ids?: "all" | number[];

  /** Specify this to exclude spam tokens from the response */
  exclude_spam_tokens?: string;

  /** Specify `erc20` or `native` to get only ERC20 tokens or native assets, respectively */
  filters?: "erc20" | "native";

  /** Maximum number of transactions to return */
  limit?: number;

  /** The offset to paginate through result sets. This is a cursor being passed from the previous response, only use what the backend returns here. */
  offset?: string;

  /** A comma separated list of additional metadata fields to include for each token. Supported values: logo, url */
  metadata?: ("logo" | "url")[];
};

export type TokenBalance = {
  chain: string;
  chain_id: number;
  address: string;
  amount: string;
  symbol?: string;
  decimals?: number;
  price_usd?: number;
  value_usd?: number;
};

export type TokenBalancesData = {
  request_time: string;
  response_time: string;
  wallet_address: string;
  balances: TokenBalance[];
};

export type TransactionsParams = {
  /** The offset to paginate through result sets. This is a cursor being passed from the previous response, only use what the backend has returned on previous responses. */
  offset?: string;

  /** Maximum number of transactions to return */
  limit?: number;

  /** Comma separated list of chain ids to get transactions for */
  chain_ids?: "all" | number[];

  /** Return only transactions with this method id */
  method_id?: string;

  /** Filter transactions to a given address */
  to?: string;

  /** Return abi decoded transactions and logs */
  decode?: boolean;
};

export type Transaction = {
  address: string;
  block_hash: string;
  block_number: string;
  block_time: string;
  block_version: number;
  chain: string;
  from: string;
  to: string;
  data: string;
  gas_price: string;
  hash: string;
  index: string;
  max_fee_per_gas: string;
  max_priority_fee_per_gas: string;
  nonce: string;
  transaction_type: string;
  value: string;
};

export type TransactionsData = {
  request_time: string;
  response_time: string;
  wallet_address: string;
  transactions: Transaction[];
  next_offset?: string | null;
};
