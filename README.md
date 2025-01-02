# React Hooks for Dune Echo

This project integrates with the Dune Echo APIs to provide easy access to token balances and transaction data for given wallets. It uses the DuneProvider to manage API key authorization and provides convenient hooks for fetching token balances and paginated transaction data.

# Installation

To get started, install the required dependencies:

```bash
npm install @duneanalytics/hooks
```

# Provider Setup

To use the Dune API, wrap your application in the DuneProvider and provide your Dune API key:

```javascript
import { DuneProvider } from '@duneanalytics/hooks';

const App = () => (
  <DuneProvider duneApiKey={YOUR_API_KEY}>
    {/* Your app components */}
  </DuneProvider>
);
```

# Props

	•	duneApiKey: Required. The API key to authenticate your requests with Dune Analytics.

# Hooks

## useTokenBalances

Fetches token balances for a specific wallet address.

### Example Usage

```javascript
import { useTokenBalances } from '@duneanalytics/hooks';

const MyComponent = ({ account }) => {
  const { data, isLoading, error } = useTokenBalances(account.address, {});

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.balances.map((balance) => (
        <li key={balance.tokenSymbol}>
          {balance.tokenSymbol}: {balance.amount}
        </li>
      ))}
    </ul>
  );
};
```

### Parameters

	•	walletAddress: Required. The Ethereum wallet address for which to fetch token balances.
	•	params: Optional. Additional parameters for the request (e.g., chain or token filters).

### Returns

	•	data: Contains the list of token balances.
	•	isLoading: A boolean indicating whether the request is in progress.
	•	error: Contains any error that occurred during the request.

## useTransactions

Fetches paginated transaction data for a specific wallet address.

### Example Usage

```javascript
import { useTransactions } from '@duneanalytics/hooks';

const TransactionHistory = ({ account }) => {
  const { data: transactionData, isLoading, error, nextPage, previousPage, currentPage } = useTransactions(account.address, {});

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul>
        {transactionData.transactions.map((tx) => (
          <li key={tx.hash}>
            {tx.from} → {tx.to} | Block: {tx.block_number}
          </li>
        ))}
      </ul>
      <button onClick={previousPage} disabled={currentPage === 0}>
        Previous Page
      </button>
      <button onClick={nextPage} disabled={!transactionData.next_offset}>
        Next Page
      </button>
      <p>Current Page: {currentPage + 1}</p>
    </div>
  );
};
```

### Parameters

	•	walletAddress: Required. The Ethereum wallet address for which to fetch transactions.
	•	params: Optional. Additional parameters for the request (e.g., chain or block filters).

### Returns

	•	data: Contains the transaction data for the current page.
	•	isLoading: A boolean indicating whether the request is in progress.
	•	error: Contains any error that occurred during the request.
	•	nextPage: Function to fetch the next page of transactions.
	•	previousPage: Function to fetch the previous page of transactions.
	•	currentPage: The current page number (0-based index).

### Error Handling

Both hooks return an error object that you can use to handle and display errors.

```javascript 
if (error) {
  console.error("Error fetching data:", error.message);
  return <p>Error: {error.message}</p>;
}
``` 

# Development
Please use node v20 for development.

# Deploying
If you have the power to deploy, you can run the following commands to deploy the package to the npm registry:

First tag a new version of the package:
*note you can also use `minor` or `major` instead of `patch` to bump the version number accordingly*

```bash
npm version patch
```

Then run the following commands to deploy the package to the npm registry:

```bash
npm run build
npm publish --access public
```

# License

This project is licensed under the MIT License.
