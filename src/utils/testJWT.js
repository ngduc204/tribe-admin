import { decodeJWT, getUserFromToken } from './jwtUtils';

// Test JWT token từ API documentation
const testToken = "eyJhbGciOiJSUzI1NiJ9.eyJpZCI6InVzZXJfaWQiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.token_signature";

console.log('Testing JWT decode...');
const decoded = decodeJWT(testToken);
console.log('Decoded JWT:', decoded);

const userData = getUserFromToken(testToken);
console.log('User data from token:', userData);
