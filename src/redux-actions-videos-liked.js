import {sdkLoaded} from './redux-actions-login.js';
import {showToastFor} from './redux-actions-toast.js';
import {fetchMyRatingsForVideos} from './redux-actions-ratings.js';

export function fetchLikedVideos() {
  return (dispatch, getState) => {
    const state = getState();
    const v = state.likedVideos;
    if (state.signedIn && !v.items && !v.loading) {
      dispatch({type: 'LIKED_VIDEOS_REQUESTED'});
      sdkLoaded().then(_ => {
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
            dispatch(showToastFor(resp ? resp.error.message : 'Unknown error', 5000));
          }
          const {items = []} = resp;
          items.forEach(video => video.myRating = 'like');
          dispatch({type: 'LIKED_VIDEOS_RECEIVED', items});
        });
      });
    }
  }
}
