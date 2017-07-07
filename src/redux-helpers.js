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
      this.addEventListener('register-reducers', e => {
        store.addReducers(e.detail);
      });
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

  registerReducers(reducers) {
    this.dispatchEvent(new CustomEvent('register-reducers', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: reducers
    }));
  }

  // abstract, called when optional store parameter passed
  _updateState() {}

}

export function lazyReducerEnhancer(nextCreator) {
  return (origReducer, preloadedState) => {
    let lazyReducers = {};
    const nextStore = nextCreator(origReducer, preloadedState);
    return {
      ...nextStore,
      addReducers(newReducers) {
        this.replaceReducer(Redux.combineReducers(lazyReducers = {
          ...lazyReducers,
          ...newReducers
        }));
      }
    }
  }
}

export function memoizedSelector(...args) {
  let lastVals = [];
  let lastResult = null;
  const selector = args.pop();
  return state => {
    let changed = false;
    const vals = args.map((arg, i) => {
      const val = arg(state);
      changed = changed || lastVals[i] !== val;
      return val;
    });
    lastVals = vals;
    return changed ? (lastResult = selector(state)) : lastResult;
  }
}