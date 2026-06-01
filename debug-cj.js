const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf8');
const env = envStr.split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if(k && v.length) acc[k] = v.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

async function run() {
  const tokenRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email: env.CJ_EMAIL, password: env.CJ_API_KEY })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.data.accessToken;

  const orderRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/getOrderDetail?orderId=SD2605180454100660100', {
    headers: { 'CJ-Access-Token': token }
  });
  const orderData = await orderRes.json();
  console.log('--- ORDER DETAIL ---');
  console.log(JSON.stringify(orderData, null, 2));

  const trackRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/logistic/track/orderNo?orderNo=SD2605180454100660100', {
    headers: { 'CJ-Access-Token': token }
  });
  const trackData = await trackRes.json();
  console.log('--- TRACKING DATA ---');
  console.log(JSON.stringify(trackData, null, 2));
}

run().catch(console.error);
