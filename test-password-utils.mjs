import { hashPassword, comparePassword, isBcryptHash, validatePasswordStrength } from '../src/app/lib/utils/password';

/**
 * Simple test script to verify password utilities work correctly.
 * Run with: node --loader ts-node/esm test-password.mjs
 */

async function testPasswordUtils() {
  console.log('🔐 Testing password utilities...\n');

  // Test password validation
  console.log('1. Testing password validation:');
  const weakPassword = validatePasswordStrength('123');
  console.log(`   Weak password "123": ${weakPassword.isValid ? 'VALID' : 'INVALID'} - ${weakPassword.error || 'OK'}`);
  
  const strongPassword = validatePasswordStrength('myStrongPassword123');
  console.log(`   Strong password: ${strongPassword.isValid ? 'VALID' : 'INVALID'} - ${strongPassword.error || 'OK'}\n`);

  // Test password hashing
  console.log('2. Testing password hashing:');
  const plainPassword = 'myTestPassword123';
  const hashedPassword = await hashPassword(plainPassword);
  console.log(`   Original: ${plainPassword}`);
  console.log(`   Hashed: ${hashedPassword}`);
  console.log(`   Is bcrypt hash: ${isBcryptHash(hashedPassword)}\n`);

  // Test password comparison
  console.log('3. Testing password comparison:');
  const isCorrect = await comparePassword(plainPassword, hashedPassword);
  const isWrong = await comparePassword('wrongPassword', hashedPassword);
  console.log(`   Correct password match: ${isCorrect}`);
  console.log(`   Wrong password match: ${isWrong}\n`);

  // Test hash detection
  console.log('4. Testing hash detection:');
  console.log(`   Plain text "password": ${isBcryptHash('password')}`);
  console.log(`   Bcrypt hash: ${isBcryptHash(hashedPassword)}`);
  console.log(`   Invalid hash format: ${isBcryptHash('$2a$10$invalid')}\n`);

  console.log('✅ All tests completed!');
}

// Run the tests
testPasswordUtils().catch(console.error);