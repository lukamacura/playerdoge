# Creating a Testnet Wallet

### **List of Bitcoin Testnet Wallets**

1. **Bitcoin Core in Prune Mode with `-testnet` Flag**:
   * Download and install Bitcoin Core from the [official website](https://bitcoin.org/en/download).
   * Go to the installation folder and open command prompt
   * Run the following command to start Bitcoin Core in testnet mode:

```
.\bitcoin-qt.exe -testnet -prune=550
```

* This setup minimizes disk usage while allowing you to connect to the Testnet blockchain. <br>

1. **OKX Wallet**:
   * [Download](https://www.okx.com/download) the OKX Wallet extension or mobile app.
   * Go to **Network Settings** and select the Bitcoin Testnet.
   * Generate testnet addresses for your testing needs.<br>
2. **Electrum**:
   * Download Electrum from the [official site](https://electrum.org/).
   * Go to installation folder and open command prompt.
   * Run the following command to start Bitcoin core in testnet mode:

```
.\electrum-4.0.6.exe --testnet
```

* Create te a wallet and use it to send/receive test Bitcoin.

### **Ethereum Testnet (Sepolia)**

1. **MetaMask on Sepolia**:
   * Install the MetaMask browser extension or mobile app.
   * Navigate to **Settings > Networks**.
   * Add the Sepolia Testnet manually if does not exist with the following details:
     * **Network Name**: Sepolia Testnet
     * **RPC URL**: `https://rpc.sepolia.org`
     * **Chain ID**: 11155111
     * **Currency Symbol**: ETH
   * Save the network and switch to it in the MetaMask dropdown.

### **Tron Testnet (Shasta)**

1. **TronLink Wallet**:
   * Install the TronLink Wallet extension or app.
   * Open the wallet, click the settings icon, and select **Shasta Testnet**.
   * Generate a wallet address for your testing activities.


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/accept-crypto-payments/testing-and-simulation/creating-a-testnet-wallet.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Accquire Testnet Assets

To test your integration, you’ll need testnet assets. Faucets provide free tokens for this purpose.

1. **Bitcoin Testnet**:
   * Use a reliable Bitcoin Testnet3 faucet, such as <https://coinfaucet.eu/en/btc-testnet/>
   * Input your testnet wallet address to receive test BTC.
2. **Ethereum Sepolia Testnet**:
   * Visit a Sepolia ETH faucet like [Google Faucet ](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)or [Sepolia Faucet](https://sepoliafaucet.com/) or [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
   * Paste your Sepolia wallet address from MetaMask to get free test ETH.
3. **Tron Shasta Testnet**:
   * Access the official [Shasta Faucet.](https://shasta.tronex.io)
   * Log in with your TronLink wallet and request testnet TRX.


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/accept-crypto-payments/testing-and-simulation/accquire-testnet-assets.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Creating Transactions

After receiving testnet assets, You will be able to create a transaction and transfer testnet asset to your integrated store:

* Generate a payment request using the Paymento API, your integrated software or Payment Link.
* Use your testnet wallet to send a test transaction to the generated address.
* Monitor the transaction status on blockchain explorers.

**Confirming Transactions**

* Verify transaction confirmations on the blockchain explorer.
* Ensure that the test payment reflects in the Paymento dashboard and API callback response.

By following these steps, you can thoroughly test and validate your Paymento integration, ensuring a reliable, secure, and user-friendly experience before going live on the mainnet


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/accept-crypto-payments/testing-and-simulation/creating-transactions.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
