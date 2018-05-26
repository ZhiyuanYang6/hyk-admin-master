const TokenKey = 'token'

export function setSession(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeSession() {
  return sessionStorage.removeItem(TokenKey);
}

export function getSession() {
  return sessionStorage.getItem(TokenKey);
}
