/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export const ReduxHelpers = (superClass, store) => class extends superClass {

  constructor() {
    super();
    // optional
    if (store) {
      this.addEventListener('action', e => store.dispatch(e.detail));
      const update = () => this._updateState(store.getState());
      store.subscribe(update);
      update();
    }
  }

  dispatchAction(action) {
    this.dispatchEvent(new CustomEvent('action', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: action
    }));
  }

  // abstract, called when optional store parameter passed
  _updateState() {}

}