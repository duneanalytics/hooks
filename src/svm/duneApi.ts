import {
  BalanceData,
  TokenBalancesParams,
  TransactionData,
  TransactionsParams,
} from "./types";

const BALANCES_PREFIX = "api/echo/beta/balances/svm";
const TRANSACTIONS_PREFIX = "api/echo/beta/transactions/svm";

const getBalanceQueryParams = (
  params: TokenBalancesParams
): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params.chains) queryParams.append("chains", params.chains);
  if (params.offset) queryParams.append("offset", params.offset.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  return queryParams;
};

const getTransactionsQueryParams = (
  params: TransactionsParams
): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params.offset) queryParams.append("offset", params.offset.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  return queryParams;
};

export async function fetchSvmBalances(
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

export async function fetchSvmTransactions(
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
