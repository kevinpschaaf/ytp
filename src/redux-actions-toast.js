/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export function showToast(text) {
  return { type: 'SHOW_TOAST', text };
}

export function hideToast() {
  return { type: 'HIDE_TOAST' };
}

export function showToastFor(text, duration) {
  return dispatch => {
    dispatch(showToast(text));
    setTimeout(() => dispatch(hideToast()), duration);
  }
}
