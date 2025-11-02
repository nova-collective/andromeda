/** 24-character hex string matching MongoDB ObjectIds. */
export const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/** Usernames: 3-32 chars, alphanumeric plus dot/underscore/hyphen. */
export const usernamePattern = /^[A-Za-z0-9._-]{3,32}$/;

/** Simple RFC-like email validation. */
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

/** Strong password: uppercase, lowercase, digit, special character, min 8 chars. */
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/** Wallet identifier: 0x-prefixed address or alphanumeric alias. */
export const walletPattern = /^(?:0x[a-fA-F0-9]{40}|[A-Za-z0-9._-]{3,64})$/;

/** Group names: 3-64 chars starting alphanumeric, allowing spaces, underscores, hyphens. */
export const groupNamePattern = /^[A-Za-z0-9][A-Za-z0-9 _-]{2,63}$/;