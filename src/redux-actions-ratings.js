/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {showToastFor} from './redux-actions-toast.js';

export function fetchMyRatingForVideo(id) {
  return (dispatch, getState) => {
    const v = getState().trendingVideos.items;
    gapi.client.request({
     path: '/youtube/v3/videos/getRating',
     params: {
       id: id
     }
    }).execute(resp => {
      if (resp.error) {
        dispatch(showToastFor(resp.error.message, 1000));
      } else {
        dispatch(setMyRatingForVideo(id, resp.items[0].rating));
      }
    });
  }
}

export function updateMyRatingForVideo(id, rating) {
  return (dispatch, getState) => {
    // optimistic
    dispatch(setMyRatingForVideo(id, rating));
    gapi.client.request({
     method: 'POST',
     path: '/youtube/v3/videos/rate',
     params: {id, rating}
    }).execute(resp => {
      if (resp && resp.error) {
        dispatch(showToastFor(resp.error.message, 1000));
      } else {
        // pessimistic
        // dispatch(setMyRatingForVideo(id, rating));
      }
    });
  }
}

function setMyRatingForVideo(id, myRating) {
  return { type: 'VIDEO_MY_RATING_SET', id, myRating}
}
