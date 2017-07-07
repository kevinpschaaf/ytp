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

import {ReduxHelpers, lazyReducerEnhancer} from './redux-helpers.js';

import {user, signedIn} from './redux-reducer-login.js';
import {currentPage} from './redux-reducer-routing.js';
import {toastInfo} from './redux-reducer-toast.js';

import {loadSDK, toggleLogin} from './redux-actions-login.js';
import {changeRoute} from './redux-actions-routing.js';

// const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
const compose = Redux.compose;

const store = Redux.createStore(() => { return {}; }, {},
  compose(lazyReducerEnhancer, Redux.applyMiddleware(ReduxThunk.default)));

// For debugging
window.store = store;

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
          <a name="profile" href="profile">
            <iron-icon icon="ytp:person"></iron-icon>Profile
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
          <ytp-profile name="profile" user="[[user]]"></ytp-profile>
          <ytp-404 name="404"></ytp-404>
        </iron-pages>
      </app-header-layout>
    </app-drawer-layout>

    <paper-toast opened="[[toastInfo.showing]]" text="[[toastInfo.text]]" duration="0"></paper-toast>`;
  }

  ready() {
    super.ready();
    this.registerReducers({ currentPage, user, signedIn, toastInfo });
    this.dispatchAction(loadSDK());
  }

  _updateState(state) {
    const videos = state.videos;
    const trendingItems = state.trendingVideos && state.trendingVideos.items;
    const likedItems = state.likedVideos && state.likedVideos.items;
    this.setProperties({
      signedIn: state.signedIn,
      user: state.user,
      toastInfo: state.toastInfo,
      page: state.currentPage,
      videos: state.videos,
      trendingVideos: trendingItems && trendingItems.map(key => videos[key]),
      trendingLoading: state.trendingVideos && state.trendingVideos.loading,
      likedVideos: likedItems && likedItems.map(key => videos[key]),
      likedLoading: state.likedVideos && state.likedVideos.loading
    });
  }

  _handleRoute(e) {
    this.dispatchAction(changeRoute(e.detail.value.path, store));
  }

  _loginIcon(signedIn) {
    return signedIn ? 'person' : 'person-outline';
  }

  _toggleLogin() {
    this.dispatchAction(toggleLogin());
  }

}

customElements.define('ytp-app', MyApp);
