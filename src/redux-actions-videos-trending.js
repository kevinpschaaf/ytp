import {sdkLoaded} from './redux-actions-login.js';
import {showToastFor} from './redux-actions-toast.js';
import {fetchMyRatingsForVideos} from './redux-actions-ratings.js';

export function fetchTrendingVideos() {
  return (dispatch, getState) => {
    const v = getState().trendingVideos;
    if (!v.items && !v.loading) {
      dispatch({type: 'TRENDING_VIDEOS_REQUESTED'});
      sdkLoaded().then(_ => {
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
          if (!resp || resp.error) {
            dispatch(showToastFor(resp ? resp.error.message : 'Unknown error', 5000));
          }
          const {items = []} = resp;
          dispatch({type: 'TRENDING_VIDEOS_RECEIVED', items});
          dispatch(fetchMyRatingsForVideos(items));
        });
      });
    }
  }
}