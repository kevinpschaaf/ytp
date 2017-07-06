/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import './../bower_components/polymer/polymer-element.html';
import './../bower_components/app-layout/app-drawer/app-drawer.html';
import './../bower_components/app-layout/app-drawer-layout/app-drawer-layout.html';
import './../bower_components/app-layout/app-header/app-header.html';
import './../bower_components/app-layout/app-header-layout/app-header-layout.html';
import './../bower_components/app-layout/app-scroll-effects/app-scroll-effects.html';
import './../bower_components/app-layout/app-toolbar/app-toolbar.html';
import './../bower_components/app-route/app-location.html';
import './../bower_components/iron-pages/iron-pages.html';
import './../bower_components/iron-selector/iron-selector.html';
import './../bower_components/iron-icon/iron-icon.html';
import './../bower_components/paper-icon-button/paper-icon-button.html';
import './../bower_components/paper-toast/paper-toast.html';
import './ytp-icons.html';

import './../bower_components/redux/index.js';
import './../bower_components/redux-thunk/index.js';

import {ReduxHelpers} from './redux-helpers.js';

import {loadSDK} from './redux-actions-login.js';
import {changeRoute} from './redux-actions-routing.js';

// const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
const compose = Redux.compose;

const store = Redux.createStore(Redux.combineReducers({
  currentPage,
  signedIn,
  toastInfo,
  user,
  videos,
  trendingVideos,
  likedVideos
}), {}, compose(Redux.applyMiddleware(ReduxThunk.default)));

// For debugging
window.store = store;

// Reducers ---------------------

function currentPage(page = null, action) {
  switch (action.type) {
    case 'CHANGE_PAGE':
      return action.page;
    default:
      return page;
  }
}

function user(user = null, action) {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    default:
      return user;
  }
}

function signedIn(signedIn = null, action) {
  switch (action.type) {
    case 'SET_SIGNED_IN':
      return action.signedIn;
    default:
      return signedIn;
  }
}

function toastInfo(info = {showing: false, text: ''}, action) {
  switch (action.type) {
    case 'SHOW_TOAST':
      return {...info, showing: true, text: action.text}
    case 'HIDE_TOAST':
      return {...info, showing: false}
    default:
      return info;
  }
}

function videos(videos = {}, action) {
  switch (action.type) {
    case 'VIDEOS_ADD':
      return {...videos, ...action.items};
    case 'VIDEO_MY_RATING_SET':
      return {...videos, [action.id]: {...videos[action.id], myRating: action.myRating}}
    default:
      return videos;
  }
}

function trendingVideos(trendingVideos = {}, action) {
  switch (action.type) {
    case 'TRENDING_VIDEOS_SET':
      return {...trendingVideos, items: action.items};
    case 'TRENDING_VIDEOS_LOADING_SET':
      return {...trendingVideos, loading: action.loading};
    default:
      return trendingVideos;
  }
}
function likedVideos(likedVideos = {}, action) {
  switch (action.type) {
    case 'LIKED_VIDEOS_SET':
      return {...likedVideos, items: action.items};
    case 'LIKED_VIDEOS_LOADING_SET':
      return {...likedVideos, loading: action.loading};
    case 'VIDEO_MY_RATING_SET':
      const {items} = likedVideos;
      const idx = items && items.indexOf(action.id);
      if (idx >= 0 && action.myRating != 'like') {
        return {...likedVideos, items: [...items.slice(0,idx), ...items.slice(idx+1)]};
      } else if (idx < 0 && action.myRating == 'like') {
        return {...likedVideos, items: items.concat([action.id])};
      } else {
        return likedVideos;
      }
    default:
      return likedVideos;
  }
}

// Action creators ---------------------

class MyApp extends ReduxHelpers(Polymer.Element, store) {

  static get template() {
    return `
    <style>
      :host {
        --app-primary-color: red;
        --app-secondary-color: black;

        display: block;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-drawer-layout:not([narrow]) [main-title] {
        visibility: hidden;
      }

      app-toolbar {
        color: #fff;
        background-color: var(--app-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      .drawer-list {
        margin: 0 20px;
      }

      .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
      }

      .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
      }
      iron-icon {
        margin-right: 10px;
      }
    </style>

    <app-location on-route-changed="_handleRoute"></app-location>

    <app-drawer-layout fullbleed="">
      <!-- Drawer content -->
      <app-drawer id="drawer" slot="drawer">
        <app-toolbar>YT Polymer</app-toolbar>
        <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
          <a name="trending" href="trending">
            <iron-icon icon="ytp:trending-up"></iron-icon>Trending
          </a>
          <a name="liked" href="liked">
            <iron-icon icon="ytp:thumb-up"></iron-icon>Liked Videos
          </a>
        </iron-selector>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout has-scrolling-region="">

        <app-header slot="header" condenses="" reveals="" effects="waterfall">
          <app-toolbar>
            <paper-icon-button icon="ytp:menu" drawer-toggle=""></paper-icon-button>
            <div main-title="">YT Polymer</div>
            <paper-icon-button icon="ytp:{{_loginIcon(signedIn)}}" on-tap="_toggleLogin"></paper-icon-button>
          </app-toolbar>
        </app-header>

        <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="view404" role="main">
          <ytp-trending name="trending" videos="[[trendingVideos]]" loading="[[trendingLoading]]"></ytp-trending>
          <ytp-liked name="liked" videos="[[likedVideos]]" loading="[[likedLoading]]" signed-in="[[signedIn]]"></ytp-liked>
          <ytp-view404 name="view404"></ytp-view404>
        </iron-pages>
      </app-header-layout>
    </app-drawer-layout>

    <paper-toast opened="[[toastInfo.showing]]" text="[[toastInfo.text]]" duration="0"></paper-toast>`;
  }

  constructor() {
    super();
    this.dispatchAction(loadSDK());
  }

  _updateState(state) {
    this.signedIn = state.signedIn;
    this.toastInfo = state.toastInfo;
    this.page = state.currentPage;
    const videos = state.videos;
    const trending = state.trendingVideos.items;
    this.trendingVideos = trending && trending.map(key => videos[key]);
    this.trendingLoading = state.trendingVideos.loading;
    const liked = state.likedVideos.items;
    this.likedVideos = liked && liked.map(key => videos[key]);
    this.likedLoading = state.likedVideos.loading;
  }

  _handleRoute(e) {
    this.dispatchAction(changeRoute(e.detail.value.path));
  }

  _loginIcon(signedIn) {
    return signedIn ? 'person' : 'person-outline';
  }

  _toggleLogin() {
    this.dispatchAction(toggleLogin());
  }

}

customElements.define('ytp-app', MyApp);
