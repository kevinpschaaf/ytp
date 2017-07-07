/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {importScript, importModule} from './utils-import.js';
import {showToastFor} from './redux-actions-toast.js';

let sdkLoadedPromise;

export function sdkLoaded() {
  return sdkLoadedPromise;
}

export function loadSDK() {
  return dispatch => {
    // sdkLoadedPromise = importScript('../mock/api.js').then(() => {
    sdkLoadedPromise = importScript('https://apis.google.com/js/api.js').then(() => {
      return new Promise(resolve => {
        gapi.load('client:auth2', () => {
          gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            clientId: '249918536085-sfdbm43fnsp7sd0s7gjqvvf9tjel691v.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/youtube'
          }).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(s => dispatch(setSignedIn(s)));
            dispatch(setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get()));
            resolve();
          });
        });
      });
    });
  }
}

function setSignedIn(signedIn) {
  return (dispatch, getState) => {
    const prevSignedIn = getState().signedIn;
    dispatch({ type: 'SET_SIGNED_IN', signedIn });
    if (signedIn) {
      dispatch(refreshSignedInState());
      gapi.client.youtube.channels.list({'part': 'snippet', 'mine': 'true'}).execute(resp => {
        if (!resp || resp.error) {
          dispatch(showToastFor(resp ? resp.error.message : 'Unknown error', 1000));
        } else {
          const user = resp.items[0].snippet;
          dispatch(setUser(user));
          dispatch(showToastFor(`Logged in as ${user.title}.`, 1000));
        }
      });
    } else {
      if (prevSignedIn) {
        dispatch(showToastFor(`Logged out.`, 1000));
        dispatch(setUser(null));
      }
    }
  }
}

function refreshSignedInState() {
  return (dispatch, getState) => {
    const state = getState();
    switch (state.currentPage) {
      case 'liked':
        importModule('./src/redux-actions-videos-liked.js').then(({fetchLikedVideos}) => {
          dispatch(fetchLikedVideos());
        });
        break;
    }
  }
}

export function toggleLogin() {
  return (dispatch, getState) => {
    if (window.gapi) {
      if (getState().signedIn) {
        gapi.auth2.getAuthInstance().signOut();
      } else {
        gapi.auth2.getAuthInstance().signIn();
      }
    }
  }
}

function setUser(user) {
  return { type: 'SET_USER', user };
}