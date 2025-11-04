import { describe, expect, it } from 'vitest';

import {
	emailPattern,
	groupNamePattern,
	objectIdPattern,
	passwordPattern,
	usernamePattern,
	walletPattern,
} from './patternsUtil';

describe('patternsUtil', () => {
	it('validates objectIdPattern', () => {
		expect(objectIdPattern.test('507f1f77bcf86cd799439011')).toBe(true);
		expect(objectIdPattern.test('not-a-valid-objectid')).toBe(false);
		expect(objectIdPattern.test('507F1F77BCF86CD799439011')).toBe(true);
		expect(objectIdPattern.test('507f1f77bcf86cd7994390')).toBe(false);
	});

	it('validates usernamePattern', () => {
		expect(usernamePattern.test('user_name-01')).toBe(true);
		expect(usernamePattern.test('ab')).toBe(false);
		expect(usernamePattern.test('user name')).toBe(false);
		expect(usernamePattern.test('a'.repeat(32))).toBe(true);
		expect(usernamePattern.test('a'.repeat(33))).toBe(false);
	});

	it('validates emailPattern', () => {
		expect(emailPattern.test('user@example.com')).toBe(true);
		expect(emailPattern.test('user.name+tag@example.co.uk')).toBe(true);
		expect(emailPattern.test('invalid-email')).toBe(false);
		expect(emailPattern.test('user@localhost')).toBe(false);
	});

	it('validates passwordPattern', () => {
		expect(passwordPattern.test('Str0ng!Pass')).toBe(true);
		expect(passwordPattern.test('weakpass')).toBe(false);
		expect(passwordPattern.test('NOLOWER123!')).toBe(false);
		expect(passwordPattern.test('noupper123!')).toBe(false);
		expect(passwordPattern.test('NoSpecial123')).toBe(false);
	});

	it('validates walletPattern', () => {
		expect(walletPattern.test('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
		expect(walletPattern.test('my.wallet_alias-01')).toBe(true);
		expect(walletPattern.test('invalid alias with spaces')).toBe(false);
	});

	it('validates groupNamePattern', () => {
		expect(groupNamePattern.test('Guild Name')).toBe(true);
		expect(groupNamePattern.test('Group_001')).toBe(true);
		expect(groupNamePattern.test(' gInvalid')).toBe(false);
		expect(groupNamePattern.test('AB')).toBe(false);
		expect(groupNamePattern.test(`A${  'x'.repeat(64)}`)).toBe(false);
	});
});
