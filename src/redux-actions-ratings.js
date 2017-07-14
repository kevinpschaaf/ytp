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

function fetchRating(id) {
  return new Promise((resolve, reject) => {
    gapi.client.request({
     path: '/youtube/v3/videos/getRating',
     params: { id }
    }).execute(resp => {
      if (resp.error) {
        reject(resp.error);
      } else {
        const r = resp.items[0];
        resolve({id: r.videoId, myRating: r.rating});
      }
    });
  });
}

export function fetchMyRatingsForVideos(videos) {
  return (dispatch, getState) => {
    Promise.all(videos.map(v => fetchRating(v.id))).then(ratings => {
      dispatch({ type: 'VIDEO_RATINGS_RECEIVED', ratings});
    }).catch(error => {
      dispatch(showToastFor(error.message, 5000));
    });
  }
}

export function updateMyRatingForVideo(id, myRating) {
  return (dispatch, getState) => {
    // optimistic
    dispatch({ type: 'VIDEO_RATING_CHANGED', id, myRating});
    gapi.client.request({
     method: 'POST',
     path: '/youtube/v3/videos/rate',
     params: {id, rating}
    }).execute(resp => {
      if (resp && resp.error) {
        dispatch(showToastFor(resp.error.message, 5000));
      } else {
        // pessimistic
        // dispatch({ type: 'VIDEO_RATING_CHANGED', id, myRating});
      }
    });
  }
}
