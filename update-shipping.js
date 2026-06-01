const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf8');
const env = envStr.split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if(k && v.length) acc[k] = v.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  await supabase.from('site_settings').update({value: 0}).eq('key', 'free_shipping_threshold');
  await supabase.from('site_settings').update({value: 0}).eq('key', 'standard_shipping_fee');
  await supabase.from('site_settings').update({value: 0}).eq('key', 'express_shipping_fee');
  console.log('Done updating DB');
}
run().catch(console.error);
