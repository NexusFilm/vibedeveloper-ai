// Debug script for production issues
// Run this in the browser console to get more detailed error information

console.log('🔍 VibeDeveloper Debug Information');
console.log('================================');

// Check environment
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  hostname: window.location.hostname,
  pathname: window.location.pathname,
  search: window.location.search
});

// Check if APIs are accessible
async function checkAPIs() {
  console.log('\n📡 API Health Check');
  console.log('==================');
  
  const apis = [
    '/api/tenant-info?slug=vibedeveloper',
    '/api/invoke-llm',
    '/api/generate-project',
    '/api/create-checkout'
  ];
  
  for (const api of apis) {
    try {
      const response = await fetch(api, { method: 'HEAD' });
      console.log(`${api}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`${api}: ERROR -`, error.message);
    }
  }
}

// Check Supabase connection
async function checkSupabase() {
  console.log('\n🗄️ Supabase Connection');
  console.log('=====================');
  
  try {
    const { supabase } = await import('./src/api/supabaseClient.js');
    const { data, error } = await supabase.from('tenants').select('count').limit(1);
    
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Supabase: Connected ✅');
    }
  } catch (error) {
    console.error('Supabase Import Error:', error);
  }
}

// Check React errors
function checkReactErrors() {
  console.log('\n⚛️ React Error Monitoring');
  console.log('========================');
  
  // Override console.error to catch React errors
  const originalError = console.error;
  console.error = function(...args) {
    if (args[0] && args[0].includes && args[0].includes('Minified React error')) {
      console.log('🚨 React Error Detected:', args);
    }
    originalError.apply(console, args);
  };
  
  console.log('React error monitoring enabled');
}

// Run all checks
async function runDiagnostics() {
  checkReactErrors();
  await checkAPIs();
  await checkSupabase();
  
  console.log('\n✅ Diagnostics complete');
  console.log('If you see errors above, please share this output for debugging');
}

// Auto-run diagnostics
runDiagnostics();

// Export for manual use
window.debugVibeDeveloper = {
  checkAPIs,
  checkSupabase,
  checkReactErrors,
  runDiagnostics
};