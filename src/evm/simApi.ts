import { removeTrailingSlash } from "../utils";
import {
  BalanceData,
  TokenBalancesParams,
  TransactionData,
  TransactionsParams,
} from "./types";

const BASE_URL = "https://api.dune.com";
const BALANCES_PREFIX = "/v1/evm/balances";
const TRANSACTIONS_PREFIX = "/v1/evm/transactions";

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

const getHeaders = (simApiKey: string | undefined) => {
  return simApiKey
    ? {
        "X-Sim-Api-Key": simApiKey,
      }
    : undefined;
};

export async function fetchEvmBalances(
  walletAddress: string,
  params: TokenBalancesParams,
  simApiKey: string | undefined,
  proxyUrl: string | undefined
): Promise<BalanceData> {
  const queryParams = getBalanceQueryParams(params);

  if (proxyUrl) {
    proxyUrl = removeTrailingSlash(proxyUrl);
  }

  const apiUrl = `${proxyUrl || BASE_URL}/${BALANCES_PREFIX}/${walletAddress}?${queryParams.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: getHeaders(simApiKey),
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
  simApiKey: string | undefined,
  proxyUrl: string | undefined
): Promise<TransactionData> {
  const queryParams = getTransactionsQueryParams(params);
  const apiUrl = `${proxyUrl || BASE_URL}/${TRANSACTIONS_PREFIX}/${walletAddress}?${queryParams.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: getHeaders(simApiKey),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/** @deprecated */
export const fetchTransactions = fetchEvmTransactions;
