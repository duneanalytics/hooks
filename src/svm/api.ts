import { HttpClient } from "../http";
import {
  TokenBalancesData,
  TokenBalancesParams,
  TransactionsData,
  TransactionsParams,
} from "./types";

export function fetchTokenBalances(
  client: HttpClient,
  walletAddress: string,
  params?: TokenBalancesParams
): Promise<TokenBalancesData> {
  return client.get<TokenBalancesData>(`/balances/svm/${walletAddress}`, {
    query: params,
  });
}

export function fetchTransactions(
  client: HttpClient,
  walletAddress: string,
  params?: TransactionsParams
): Promise<TransactionsData> {
  return client.get<TransactionsData>(`/transactions/svm/${walletAddress}`, {
    query: params,
  });
}
