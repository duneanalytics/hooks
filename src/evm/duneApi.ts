import {
  BalanceData,
  TokenBalancesParams,
  TransactionData,
  TransactionsParams,
} from "./types";

const BALANCES_PREFIX = "api/echo/v1/balances/evm";
const TRANSACTIONS_PREFIX = "api/echo/v1/transactions/evm";

const getBalanceQueryParams = (
  params: TokenBalancesParams
): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params.allChains) queryParams.append("all_chains", "true");
  if (params.chainIds) queryParams.append("chain_ids", params.chainIds);
  if (params.excludeSpamTokens)
    queryParams.append("exclude_spam_tokens", "true");
  if (params.filters) queryParams.append("filters", params.filters);
  if (params.offset) queryParams.append("offset", params.offset.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.metadata) queryParams.append("metadata", "logo,url");
  return queryParams;
};

const getTransactionsQueryParams = (
  params: TransactionsParams
): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params.chainIds) queryParams.append("chain_ids", params.chainIds);
  if (params.offset) queryParams.append("offset", params.offset.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.method_id) queryParams.append("method_id", params.method_id);
  if (params.to) queryParams.append("to", params.to);
  if (params.decode) queryParams.append("decode", params.decode.toString());
  return queryParams;
};

export async function fetchEvmBalances(
  walletAddress: string,
  params: TokenBalancesParams,
  duneApiKey: string,
  baseUrl: string
): Promise<BalanceData> {
  const queryParams = getBalanceQueryParams(params);
  const apiUrl = `${baseUrl}/${BALANCES_PREFIX}/${walletAddress}?${queryParams.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-dune-api-key": duneApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/** @deprecated */
export const fetchBalances = fetchEvmBalances;

export async function fetchEvmTransactions(
  walletAddress: string,
  params: TransactionsParams,
  duneApiKey: string,
  baseUrl: string
): Promise<TransactionData> {
  const queryParams = getTransactionsQueryParams(params);
  const apiUrl = `${baseUrl}/${TRANSACTIONS_PREFIX}/${walletAddress}?${queryParams.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-dune-api-key": duneApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/** @deprecated */
export const fetchTransactions = fetchEvmTransactions;
