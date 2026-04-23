# API Overview

To integrate with Paymento, you'll first need to create a merchant account at [https://app.paymento.io](https://app.paymento.io/) and obtain an API Key. This key is essential for all API calls, enabling your application to communicate with Paymento's services.

The figure below shows how stores connect with Paymento through APIs.

<figure><img src="https://1349701107-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FJHb4mMI51Qf1IN0bWcbg%2Fuploads%2FqSLnZUE9QJttAdir87Vl%2Fapi-overview.png?alt=media&#x26;token=0b5cf8f3-8a58-47a4-a218-90cb177bd778" alt=""><figcaption></figcaption></figure>

1\) To initiate a payment, your online store must send a payment request to the Paymento API.&#x20;

2\) A successful request will create an order for the transaction and return a token in the response. This token is used to redirect the user to the payment page.

3\) With the token received from creating the payment request, redirect the user to the Paymento payment page where they can choose from the allowed cryptocurrencies to complete the payment.

* **Payment URL:** `https://app.paymento.io/gateway?token=TOKEN_HERE`

Replace `TOKEN_HERE` with the token you received in the previous step.<br>

4\) After the payment is made, Paymento sends the payment status and details to the callback URL you've specified. Also, the end user will be redirected back to your site.

5\) It's crucial to verify the payment to finalize the order on your end. Upon receiving the payment notification, make an API call to confirm the payment status with the token you received.

<br>


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/api-overview.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Payment Request

How to create a payment request and get a token for redirecting customer to paymento gateway.

## Request a new payment

<mark style="color:green;">`POST`</mark> <https://api.paymento.io/v1/payment/request>

**Headers**

| Name         | Value                 |
| ------------ | --------------------- |
| Api-key      | Your Merchant API Key |
| Content Type | `application/json`    |
| Accept       | `text/plain`          |

**Body**

<table><thead><tr><th width="185">Name</th><th width="132">Type</th><th>Nullable</th><th>Description</th></tr></thead><tbody><tr><td><code>fiatAmount</code></td><td>string</td><td>true</td><td></td></tr><tr><td><code>fiatCurrency</code></td><td>string</td><td>true</td><td>(e.g.) USD or EUR</td></tr><tr><td><code>ReturnUrl</code></td><td>string</td><td>true</td><td></td></tr><tr><td><code>orderId</code></td><td>string</td><td>true</td><td>Your online store order ID</td></tr><tr><td><code>Speed</code></td><td>int</td><td>false</td><td><p> 0 = High</p><p>(Accept crypto transactions on mempool and complete order.</p><p>)</p><p>1 = Low</p><p>(Accept crypto transactions when specific number of blocks came (known as confirmed like 3 as 3) and complete order. </p><p>)</p></td></tr><tr><td><code>cryptoAmount</code></td><td>Json Object</td><td>true</td><td><p><code>[ { "coinName": "Bitcoin", "amount": "0.01854793" }, { "coinName": "Ethereum", "amount":</code> </p><p><code>"1.54848465" } ]</code></p></td></tr><tr><td><code>additionalData</code></td><td>Json Object</td><td>true</td><td><code>[ { "key": "invoice-number", "value": "A-578" }, { "key": "param2", "value": "value2" } ]</code></td></tr><tr><td><code>EmailAddress</code></td><td>string</td><td>true</td><td>Email address of the user</td></tr></tbody></table>

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "success": true,
  "message": "",
  "body": " 3256e147c6fe4d36a9341a5112ed2214"
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "error": "Invalid request"
}
```

{% endtab %}
{% endtabs %}

Now you can use the received token in body section and redirect your customer to&#x20;

* **Payment URL:** `https://app.paymento.io/gateway?token=TOKEN_HERE`

Replace `TOKEN_HERE` with the token you received.


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/payment-request.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Payment Callback

After a payment request is made and the user navigates to the Paymento gateway to complete the payment, the user is redirected back to the merchant's Return URL (Given in Payment Request) with a specific status. This allows the merchant to update the order status in their interface. However, it is crucial for merchants to use the [Set Payment Settings API](https://docs.paymento.io/api-documention/additional-apis/manage-payment-settings) to define the IPN URL for receiving payment statuses and to verify the payment using the Verify Payment API.

### Redirect and Callback Data

Paymento returns the following variables in the Callback (to Return URL and IPN URL):

#### HTTP Headers

<table><thead><tr><th>Name</th><th>Value</th><th data-hidden></th></tr></thead><tbody><tr><td><strong>X-HMAC-SHA256-SIGNATURE</strong></td><td>“Signature hash…”</td><td></td></tr></tbody></table>

#### Body Patameters&#x20;

| Name               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| **Token**          | Token of the payment order.                              |
| **PaymentId**      | The order ID in Paymento (Payment ID, as a long number). |
| **OrderId**        | The order ID from the online store (as a string).        |
| **OrderStatus**    | The order status (explained in next paragraph)           |
| **AdditionalData** | The payment request's additional data.                   |

### Order Statuses

When the user completes or cancels the payment, Paymento redirects them to the specified callback URL with one of the following statuses:

* **Initialize (0)**: Payment request accepted by the API.
* **Pending (1)**: User has chosen a coin to pay.
* **PartialPaid (2)**: User paid less than the order amount.
* **WaitingToConfirm (3)**: User's transaction received in the blockchain network (in mempool or block).
* **Timeout (4)**: Payment deadline expired.
* **UserCanceled (5)**: User clicked on the cancel button at the gateway.
* **Paid (7)**: User's transaction confirmed in the blockchain network.
* **Approve (8)**: Payment verified by the store.
* **Reject (9)**: Address assigned for the user's payment is no longer monitored, or payment not verified by the store.

### HMAC Signature Verification

To ensure the integrity and authenticity of callbacks from Paymento, we use HMAC-SHA256 signatures. For each callback, Paymento includes a signature in the `X-Hmac-Sha256-Signature` header. To verify this signature:

1. Obtain the raw payload of the callback (the entire body of the POST request).
2. Use your secret key (Provided in your Paymento dashboard).
3. Calculate the HMAC-SHA256 hash of the payload using your secret key.
4. Convert the resulting hash to uppercase hexadecimal format.
5. Compare this calculated signature with the one received in the `X-Hmac-Sha256-Signature` header.

```
// The signatures should match exactly. Here's a pseudo-code example:

receivedSignature = headers['X-HMAC-SHA256-SIGNATURE']
payload = request.rawBody
secretKey = "Your-Secret-Key-From-Paymento-Dashboard"
calculatedSignature = uppercase(hmac_sha256(payload, secretKey))
isValid = (calculatedSignature == receivedSignature)

```

### Important notes

**Do Not Rely Solely on Redirect to Return URL**: Merchants must use the IPN URL set in the "Set Payment Settings API" to receive real-time payment status updates.

**Always Verify Payments**: Even after receiving a "Paid" status, always verify the payment [using the Verify Payment API](https://docs.paymento.io/api-documention/payment-verify) to ensure the transaction is confirmed on the blockchain and status update came from Paymento.

#### Call Back Example

```
curl 
-X POST https://yoursite.com/shop/payment-result 
-H 'Accept: application/json' 
-H 'HMAC_SHA256_SIGNATURE: 42FBF2A14FEF5E9D89B92731F4F12B9153438C8F06F60D62AA8A8D0ADD551E7B' 
-H 'Content-Type: application/json' 
-d '{"Token":"d1179e54e58d4e51a285a5c659a2b7ef","PaymentId":20016,"OrderId":"etp-3900","OrderStatus":3,"AdditionalData":[]}'  
```


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/payment-callback.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Payment Verify

Upon receiving the payment notification, make an API call to confirm the payment status with the token you received.

## Verify a Payment

<mark style="color:green;">`POST`</mark> <https://api.paymento.io/v1/payment/verify>

**Headers**

| Name         | Value                 |
| ------------ | --------------------- |
| Api-key      | Your Merchant API Key |
| Content Type | `application/json`    |
| Accept       | `text/plain`          |

**Body**

| Name    | Type   | Nullable | Description                          |
| ------- | ------ | -------- | ------------------------------------ |
| `token` | string | false    | Token received from payment request. |

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "success": true,
  "message": "",
  "body": {
    "token": "3256e147c6fe4d36a9341a5112ed2214",
    "orderId": "5855",
    "additionalData": [
      {
        "key": "invoice-number",
        "value": "A-578"
      },
      {
        "key": "param2",
        "value": "value2"
      }
    ]
  }
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "error": "Invalid request"
}
```

{% endtab %}
{% endtabs %}


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/payment-verify.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Additional APIs

Let's expands on the main Paymento Gateway API Documentation to cover additional APIs that you may find useful for managing your online store's payment processing capabilities. These APIs provide functionality for retrieving a list of accepted cryptocurrencies and configuring payment settings, including callback URLs and HTTP methods for callbacks.


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/additional-apis.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Additional APIs

Let's expands on the main Paymento Gateway API Documentation to cover additional APIs that you may find useful for managing your online store's payment processing capabilities. These APIs provide functionality for retrieving a list of accepted cryptocurrencies and configuring payment settings, including callback URLs and HTTP methods for callbacks.


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/additional-apis.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
# Get List of Accepted Coins

This API allows you to retrieve a list of cryptocurrencies that your merchant account is currently set up to accept. This can be particularly useful for dynamically updating your payment options based on your current Paymento settings.

## Create a new user

<mark style="color:green;">`GET`</mark> <https://api.paymento.io/v1/payment/coins&#x20>;

**Headers**

| Name         | Value                 |
| ------------ | --------------------- |
| Api-Key      | Your Merchant API Key |
| Content Type | `application/json`    |
| Accept       | `text/plain`          |

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "success": true,
  "message": "",
  "body": [{
    "name": "bitcoin",
    "shortcut":  "btc"
  },
  {
    "name": "ethereum",
    "shortcut":  "eth"
  }]
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "error": "Invalid request"
}
```

{% endtab %}
{% endtabs %}


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.paymento.io/api-documention/additional-apis/get-list-of-accepted-coins.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
