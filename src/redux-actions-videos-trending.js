import {sdkLoaded} from './redux-actions-login.js';
import {showToastFor} from './redux-actions-toast.js';
import {addVideos} from './redux-actions-videos.js';
import {fetchMyRatingForVideo} from './redux-actions-ratings.js';

export function fetchTrendingVideos() {
  return (dispatch, getState) => {
    const v = getState().trendingVideos;
    if (!v.items && !v.loading) {
      sdkLoaded().then(_ => {
        dispatch(setTrendingVideosLoading(true));
        gapi.client.request({
         path: '/youtube/v3/videos',
         params: {
           chart: 'mostPopular',
           regionCode: 'US',
           part: 'snippet,contentDetails,statistics',
           videoCategoryId: '',
           maxResults: 30
         }
        }).execute(resp => {
          if (resp.error) {
            dispatch(showToastFor(resp.error.message, 1000));
          } else {
            dispatch(setTrendingVideosLoading(false));
            dispatch(setTrendingVideos(resp.items));
            resp.items.forEach(v => dispatch(fetchMyRatingForVideo(v.id)));
          }
        });
      });
    }
  }
}

function setTrendingVideosLoading(loading) {
  return { type: 'TRENDING_VIDEOS_LOADING_SET', loading }
}

function setTrendingVideos(items) {
  return dispatch => {
    dispatch(addVideos(items));
    dispatch({
      type: 'TRENDING_VIDEOS_SET',
      items: items.map(v => v.id)
    });
  }
}