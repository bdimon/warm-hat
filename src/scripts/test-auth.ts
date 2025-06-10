import { supabase } from '../lib/supabase-client';

// Configuration
const API_URL = 'http://localhost:3010';
const TEST_EMAIL = 'test-admin@example.com';
const TEST_PASSWORD = 'securepassword123';

async function testAuth() {
  console.log('🔑 Testing authentication middleware...');
  
  try {
    // 1. Create a test user if needed
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (userError) {
      console.error('Error creating test user:', userError);
      return;
    }
    
    console.log('👤 Test user created or already exists');
    
    // 2. Sign in to get a token
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (authError) {
      console.error('Error signing in:', authError);
      return;
    }
    
    const token = authData.session.access_token;
    console.log('🔐 Successfully obtained access token');
    
    // 3. Add admin role to the user (using Supabase SQL or API)
    // This would typically be done through the Supabase dashboard or a separate admin script
    console.log('⚠️ Make sure to manually add this user to the user_roles table with admin role');
    console.log(`User ID: ${authData.user.id}`);
    
    // 4. Test authentication endpoint
    try {
      const authResponse = await  fetch(`${API_URL}/api/test/auth-test`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!authResponse.ok) {
        throw new Error(`HTTP error! Status: ${authResponse.status}`);
      }
      const authData = await authResponse.json();
      console.log('✅ Authentication test passed:', authData);
    } catch (error) {
      console.error('❌ Authentication test failed:', error.response?.data || error.message);
    }
    
    // 5. Test admin endpoint
    try {
      const adminResponse = await fetch(`${API_URL}/api/test/admin-test`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!adminResponse.ok) {
        throw new Error(`HTTP error! Status: ${adminResponse.status}`);
      }
      const adminData = await adminResponse.json();
      console.log('✅ Admin test passed:', adminData);
    } catch (error) {
      console.error('❌ Admin test failed:', error.response?.data || error.message);
    }
    
    // 6. Test with invalid token
    try {
      const invalidResponse = await fetch(`${API_URL}/api/test/auth-test`, {
        headers: { Authorization: `Bearer invalid_token` }
      });
      if (invalidResponse.ok) {
        console.error('❌ Invalid token test failed: Should have rejected the request');
      } else {
        const errorData = await invalidResponse.json();
        console.log('✅ Invalid token correctly rejected:', errorData);
      }
    } catch (error) {
      console.log('✅ Invalid token correctly rejected:', error.message);
    }
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

testAuth();

