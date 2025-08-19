const paypal = require('@paypal/checkout-server-sdk');

let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

function environment() {
    let env = process.env.NODE_ENV || 'sandbox';
    if (env === 'production') {
        return new paypal.core.LiveEnvironment(clientId, clientSecret);
    } else {
        return new paypal.core.SandboxEnvironment(clientId, clientSecret);
    }
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client, paypal };
