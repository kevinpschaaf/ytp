export function user(user = null, action) {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    default:
      return user;
  }
}

export function signedIn(signedIn = null, action) {
  switch (action.type) {
    case 'SET_SIGNED_IN':
      return action.signedIn;
    default:
      return signedIn;
  }
}
