import {sdkLoaded} from './redux-actions-login.js';
import {showToastFor} from './redux-actions-toast.js';
import {addVideos} from './redux-actions-videos.js';
import {fetchMyRatingForVideo} from './redux-actions-ratings.js';

export function fetchLikedVideos() {
  return (dispatch, getState) => {
    const state = getState();
    const v = state.likedVideos;
    if (state.signedIn && !v.items && !v.loading) {
      sdkLoaded().then(_ => {
        dispatch(setLikedVideosLoading(true));
        gapi.client.request({
         path: '/youtube/v3/videos',
         params: {
           myRating: 'like',
           regionCode: 'US',
           part: 'snippet,contentDetails,statistics',
           videoCategoryId: '',
           maxResults: 30
         }
        }).execute(resp => {
          if (!resp || resp.error) {
            dispatch(showToastFor(resp ? resp.error.message : 'Unknown error', 1000));
          } else {
            dispatch(setLikedVideosLoading(false));
            dispatch(setLikedVideos(resp.items));
            resp.items.forEach(v => dispatch(fetchMyRatingForVideo(v.id)));
          }
        });
      });
    }
  }
}


function setLikedVideosLoading(loading) {
  return { type: 'LIKED_VIDEOS_LOADING_SET', loading }
}

function setLikedVideos(items) {
  return dispatch => {
    dispatch(addVideos(items));
    dispatch({
      type: 'LIKED_VIDEOS_SET',
      items: items.map(v => v.id)
    });
  }
}
