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
import './../bower_components/polymer/lib/elements/dom-repeat.html';
import './../bower_components/paper-spinner/paper-spinner-lite.html';

import './ytp-video-card.js';

class YtpTrending extends Polymer.Element {

  static get template() { return `
    <style>
      :host {
        display: block;
        padding: 10px;
      }
      ytp-video-card {
        margin: 5px;
      }
      paper-spinner-lite:not([active]) {
        display: none;
      }
    </style>

    <h2>Now trending</h2>
    <paper-spinner-lite active="[[loading]]"></paper-spinner-lite>
    <template is="dom-repeat" items="[[videos]]" as="video">
      <ytp-video-card video="[[video]]"></ytp-video-card>
    </template>`;
  }
}

customElements.define('ytp-trending', YtpTrending);