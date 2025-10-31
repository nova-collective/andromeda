export const objectIdPattern = /^[0-9a-fA-F]{24}$/;
export const usernamePattern = /^[A-Za-z0-9._-]{3,32}$/;
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export const walletPattern = /^(?:0x[a-fA-F0-9]{40}|[A-Za-z0-9._-]{3,64})$/;
export const groupNamePattern = /^[A-Za-z0-9][A-Za-z0-9 _-]{2,63}$/;