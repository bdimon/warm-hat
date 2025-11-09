import axios from 'axios';

const VITE_PORT = 5173;
const API_PORT = 3010;
const MAX_RETRIES = 20;
const RETRY_INTERVAL = 1000; // 1 second

interface EndpointCheck {
  url: string;
  name: string;
}

const endpoints: EndpointCheck[] = [
  // Frontend
  { url: `http://localhost:${VITE_PORT}`, name: 'Vite Dev Server' },
  
  // API Health
  { url: `http://localhost:${API_PORT}/health`, name: 'API Server Health' },
  { url: `http://localhost:${API_PORT}/api/test`, name: 'API Test Endpoint' },
  
  // Products API
  { url: `http://localhost:${API_PORT}/api/products`, name: 'Products List' },
  { url: `http://localhost:${API_PORT}/api/products?page=1&pageSize=10`, name: 'Products Pagination' },
  
  // Users API
  { url: `http://localhost:${API_PORT}/api/users`, name: 'Users List' },
  
  // Orders API
  { url: `http://localhost:${API_PORT}/api/orders`, name: 'Orders List' },
  
  // Auth Endpoints (these will return 400/401 which is OK)
  { url: `http://localhost:${API_PORT}/api/auth/login`, name: 'Auth Login Endpoint' },
  { url: `http://localhost:${API_PORT}/api/auth/register`, name: 'Auth Register Endpoint' }
];

async function checkEndpoint(endpoint: EndpointCheck): Promise<boolean> {
  try {
    const response = await axios.get(endpoint.url, { 
      timeout: 5000,
      validateStatus: (status) => status < 500 // Accept any status < 500
    });
    console.log(`✓ ${endpoint.name} is responding (${response.status})`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`✗ ${endpoint.name} check failed: ${error.message}`);
    } else {
      console.log(`✗ ${endpoint.name} check failed with unknown error`);
    }
    return false;
  }
}

async function waitForEndpoint(endpoint: EndpointCheck): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const isAvailable = await checkEndpoint(endpoint);
    if (isAvailable) return true;
    
    console.log(`Retrying ${endpoint.name} in ${RETRY_INTERVAL/1000}s... (${i + 1}/${MAX_RETRIES})`);
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
  }
  return false;
}

async function main() {
  console.log('Starting servers health check...');
  
  const results = await Promise.all(
    endpoints.map(endpoint => waitForEndpoint(endpoint))
  );
  
  const allSuccessful = results.every(result => result);
  
  if (allSuccessful) {
    console.log('\n✓ All endpoints are available');
    process.exit(0);
  } else {
    console.error('\n✗ Some endpoints failed to respond');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
