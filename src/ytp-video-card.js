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

import {ReduxHelpers} from './redux-helpers.js';
import {updateMyRatingForVideo} from './redux-actions-ratings.js';

class YtpVideoCard extends ReduxHelpers(Polymer.Element) {

  static get template() { return `
    <style>
      :host {
        display: inline-block;
        box-sizing: border-box;
        max-width: 340px;
        padding: 10px;
        background: white;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }
      .title, .user {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .user {
        font-size: 0.7em;
        color: gray;
      }
      img {
        height: 180px;
        width: 320px;
      }
      paper-icon-button {
        color: gray;
      }
      paper-icon-button.highlight {
        color: black;
      }
    </style>

    <img src="[[video.snippet.thumbnails.medium.url]]"><br>
    <div class="user">[[video.snippet.channelTitle]]</div>
    <div class="title">[[video.snippet.title]]</div>
    <paper-icon-button icon="ytp:thumb-up" class$="[[_likeClass(video.myRating, 'like')]]" on-tap="_updateMyRating"></paper-icon-button>
    <paper-icon-button icon="ytp:thumb-down" class$="[[_likeClass(video.myRating, 'dislike')]]" on-tap="_updateMyRating"></paper-icon-button><br>`;
  }

  _updateMyRating(e) {
    const {id, myRating} = this.video;
    let newRating;
    if (e.target.icon == 'ytp:thumb-down' && myRating !== 'dislike') {
      newRating = 'dislike';
    } else if (e.target.icon == 'ytp:thumb-up' && myRating !== 'like') {
      newRating = 'like';
    } else {
      newRating = 'none';
    }
    this.dispatchAction(updateMyRatingForVideo(id, newRating));
  }

  _likeClass(myRating, rating) {
    return myRating == rating ? 'highlight' : '';
  }

}

customElements.define('ytp-video-card', YtpVideoCard);
