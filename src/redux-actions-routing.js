import {importModule} from './utils-import.js';

export function changeRoute(path, store) {
  return (dispatch, getState) => {
    const state = getState();
    const parts = path.slice(1).split('/');
    const [page] = parts;
    if (page !== state.currentPage) {
      dispatch(loadPage(page || 'trending', store));
    }
  }
}

function loadPage(page, store) {
  return (dispatch, getState) => {
    switch(page) {
      case 'trending':
        Promise.all([
          importModule('./src/redux-reducer-videos.js'),
          importModule('./src/redux-reducer-videos-trending.js'),
          importModule('./src/redux-actions-videos-trending.js')
        ]).then(([{videos}, {trendingVideos}, {fetchTrendingVideos}]) => {
          store.addReducers({videos, trendingVideos});
          dispatch(fetchTrendingVideos());
        });
        break;
      case 'liked':
        Promise.all([
          importModule('./src/redux-reducer-videos.js'),
          importModule('./src/redux-reducer-videos-liked.js'),
          importModule('./src/redux-actions-videos-liked.js')
        ]).then(([{videos}, {likedVideos}, {fetchLikedVideos}]) => {
          store.addReducers({videos, likedVideos});
          dispatch(fetchLikedVideos());
        });
        break;
    }
    importModule('/src/ytp-' + page + '.js',
      _ => dispatch(changePage(page)),
      _ => dispatch(loadPage('404')), true);
  }
}

function changePage(page) {
  return { type: 'CHANGE_PAGE', page };
}