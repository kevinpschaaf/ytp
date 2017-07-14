export function user(user = null, action) {
  switch (action.type) {
    case 'USER_LOGGED_OUT':
    case 'USER_LOGGED_IN':
      return action.user || null;
    default:
      return user;
  }
}

export function signedIn(signedIn = null, action) {
  switch (action.type) {
    case 'USER_LOGGED_IN':
    case 'USER_LOGGED_OUT':
      return Boolean(action.user);
    default:
      return signedIn;
  }
}
