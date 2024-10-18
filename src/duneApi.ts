
import {BalanceData, TokenBalancesParams, TransactionData} from "./types";

const BALANCE_API_BASE_URL = "https://api.dune.com/api/beta/balance";
const TRANSACTIONS_API_BASE_URL = "https://api.dune.com/api/beta/transactions";


const getQueryParams = (params: TokenBalancesParams): URLSearchParams => {
    const queryParams = new URLSearchParams();
    if (params.allChains) queryParams.append("all_chains", "true");
    if (params.chainIds) queryParams.append("chain_ids", params.chainIds);
    if (params.excludeSpamTokens) queryParams.append("exclude_spam_tokens", "true");
    if (params.filters) queryParams.append("filters", params.filters);
    if (params.offset) queryParams.append("offset", params.offset.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    return queryParams;
  };

export async function fetchBalances(walletAddress: string, params: TokenBalancesParams, duneApiKey: string): Promise<BalanceData> {
    const queryParams = getQueryParams(params)
    const apiUrl = `${BALANCE_API_BASE_URL}/${walletAddress}?${queryParams.toString()}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 
      "x-dune-api-key": duneApiKey 
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchTransactions(walletAddress: string, params: TokenBalancesParams, duneApiKey: string): Promise<TransactionData> {
    const queryParams = getQueryParams(params)
    const apiUrl = `${TRANSACTIONS_API_BASE_URL}/${walletAddress}?${queryParams.toString()}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 
      "x-dune-api-key": duneApiKey 
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}