# The 10-Minute Clarity Reset

This project is a production-ready, mobile-first landing page for the `£3` digital product **The 10-Minute Clarity Reset**, plus a minimal Stripe webhook and a simple success page.

## Stack

This project uses:

- Plain `HTML`, `CSS`, and small `JavaScript` helpers for the landing page and success page
- One minimal serverless Stripe webhook using the official Stripe Node SDK

Why this stack:

- The product is a single low-ticket PDF, so speed and clarity matter more than framework complexity
- Stripe-hosted checkout keeps the purchase flow clean and trustworthy
- A tiny webhook gives you secure server-to-server payment confirmation without adding a database or auth system

## File structure

```text
.
|-- api/
|   `-- webhook.js
|-- assets/
|   `-- og-image.svg
|-- success/
|   |-- index.html
|   `-- success.js
|-- .env.example
|-- config.js
|-- index.html
|-- package.json
|-- script.js
|-- styles.css
`-- README.md
```

## Setup

Install dependencies:

```bash
npm install
```

Serve the site locally with any static file server, for example:

```bash
npx serve .
```

## Environment variables

Create a local `.env` file from [.env.example](C:/Users/Zacharias/zacharias/.env.example).

Required values:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

These are used only by [api/webhook.js](C:/Users/Zacharias/zacharias/api/webhook.js).

## Stripe checkout URL

The live Stripe checkout URL is stored in [config.js](C:/Users/Zacharias/zacharias/config.js).

Current value:

```js
STRIPE_CHECKOUT_URL: "https://buy.stripe.com/fZu8wQ84Q0iR3eX4253ks01";
```

All landing page CTA buttons use that one value.

Important:

- Use the short reusable Stripe Payment Link in site config
- Do **not** use or test a long URL that starts with `/c/pay/cs_test_...` in site config
- That long URL is a one-off Checkout Session URL, not the reusable Payment Link

## Replace the PDF download URL

Update `PDF_DOWNLOAD_URL` in [config.js](C:/Users/Zacharias/zacharias/config.js).

Current value:

```js
PDF_DOWNLOAD_URL: "/10-Minute-Clarity-Reset.pdf";
```

The main button on [success/index.html](C:/Users/Zacharias/zacharias/success/index.html) uses that value.

## Webhook route

The Stripe webhook endpoint is:

```text
/api/webhook
```

It handles:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

When one of those events arrives and the Stripe signature is valid, the webhook logs:

- Stripe session ID
- customer email

It then returns `200` quickly.

## How the webhook works

The redirect to `/success` is only for user experience. It gets the customer back to your site, but it is **not** secure proof of payment by itself.

The webhook is required because Stripe sends it server-to-server and signs it. Your backend verifies that signature with `STRIPE_WEBHOOK_SECRET`, which tells you the payment event is real.

In this setup:

1. The landing page sends users to your Stripe Payment Link
2. After payment, Stripe redirects them to `/success`
3. Stripe also sends a signed webhook event to `/api/webhook`
4. The webhook verifies the signature and logs the confirmed payment

## Important limitation of the current PDF delivery

The success page currently uses a direct download link from [config.js](C:/Users/Zacharias/zacharias/config.js).

That keeps the flow simple, but it is not fully protected if someone shares the file URL. The webhook gives you secure payment confirmation, but truly protected delivery would need a future step such as:

- a signed expiring download URL
- a one-time token
- lightweight storage of paid session IDs

For now, this project intentionally stays minimal and does **not** add a database, login, or account system.

## Fix Stripe post-payment redirect

The problem was that Stripe Payment Link was showing Stripe's own hosted success page after payment instead of sending buyers back to your site.

The fix is in the Stripe dashboard, not in application code.

Set your Stripe Payment Link to redirect to:

```text
https://www.getclarityprotocol.com/success?session_id={CHECKOUT_SESSION_ID}
```

### Exact Stripe dashboard steps

1. Open Stripe Dashboard.
2. Go to `Payment Links`.
3. Open the live Payment Link `fZu8wQ84Q0iR3eX4253ks01`.
4. Click `Edit`.
5. Go to `After the payment`.
6. Change it from Stripe-hosted confirmation page to `Redirect to URL`.
7. Set the redirect URL to:

```text
https://www.getclarityprotocol.com/success?session_id={CHECKOUT_SESSION_ID}
```

8. Save the Payment Link.
9. Save and test the live Payment Link carefully using the short reusable Payment Link, not the long `/c/pay/cs_...` URL.

The `/success` page is only for successful payments.

The webhook remains the source of truth for payment confirmation.

## Why the webhook matters more than the redirect

Users can land on `/success` without your server proving payment. Redirects are not a trusted payment confirmation source.

The webhook is the trusted confirmation source because:

- Stripe sends it directly to your backend
- Stripe signs it
- your code verifies the signature before accepting the event

## Vercel deployment

1. Push this project to GitHub.
2. Import the repo into Vercel.
3. Add environment variables in Vercel:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. In Stripe, create or update your webhook endpoint to:

```text
https://your-domain.com/api/webhook
```

5. Subscribe the webhook to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
6. In your Stripe Payment Link settings, set the success redirect to:

```text
https://www.getclarityprotocol.com/success?session_id={CHECKOUT_SESSION_ID}
```

7. Replace `PDF_DOWNLOAD_URL` in [config.js](C:/Users/Zacharias/zacharias/config.js) with your real hosted PDF file URL.
8. Confirm `STRIPE_CHECKOUT_URL` in [config.js](C:/Users/Zacharias/zacharias/config.js) is set to your live Stripe Payment Link.

## Local webhook testing

If you want to test the webhook locally, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Then use the webhook signing secret Stripe CLI gives you as `STRIPE_WEBHOOK_SECRET`.

## Editing notes

- Landing page structure and copy: [index.html](C:/Users/Zacharias/zacharias/index.html)
- Visual styling: [styles.css](C:/Users/Zacharias/zacharias/styles.css)
- Checkout and download URLs: [config.js](C:/Users/Zacharias/zacharias/config.js)
- Landing page CTA wiring: [script.js](C:/Users/Zacharias/zacharias/script.js)
- Success page: [success/index.html](C:/Users/Zacharias/zacharias/success/index.html)
- Success page download wiring: [success/success.js](C:/Users/Zacharias/zacharias/success/success.js)
- Stripe webhook endpoint: [api/webhook.js](C:/Users/Zacharias/zacharias/api/webhook.js)

## End-to-end test

1. In Stripe dashboard, confirm your live Payment Link `fZu8wQ84Q0iR3eX4253ks01` has `After the payment` set to `Redirect to URL`.
2. Confirm the redirect URL is:

```text
https://www.getclarityprotocol.com/success?session_id={CHECKOUT_SESSION_ID}
```

3. Open your landing page and click the checkout CTA.
4. Confirm the browser opens the short live Payment Link:

```text
https://buy.stripe.com/fZu8wQ84Q0iR3eX4253ks01
```

5. For a safe live verification, first click through without paying and confirm the link is correct.
6. If you want to test the full live flow, use a real low-value purchase you can refund immediately in Stripe.
7. Confirm you are redirected to `/success` on your site instead of staying on Stripe's hosted confirmation page.
8. Confirm the success page shows:
   - `Purchase confirmed`
   - `Your download is ready`
   - `Thank you for your purchase`
   - `Download The 10-Minute Clarity Reset`
   - `A receipt has been sent to your email`
9. Confirm the download button uses the shared `PDF_DOWNLOAD_URL` value.
10. Do not manually test with a long `/c/pay/cs_...` URL, because that is a one-off Checkout Session URL and can bypass the normal reusable Payment Link flow.
11. In Stripe dashboard or hosting logs, confirm the webhook was delivered successfully to:

```text
https://www.getclarityprotocol.com/api/webhook
```
