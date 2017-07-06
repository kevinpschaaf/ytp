import {importModule} from './utils-import.js';
import {fetchTrendingVideos} from './redux-actions-videos-trending.js';
import {fetchLikedVideos} from './redux-actions-videos-liked.js';

export function changeRoute(path) {
  return (dispatch, getState) => {
    const state = getState();
    const parts = path.slice(1).split('/');
    const [page] = parts;
    if (page !== state.currentPage) {
      dispatch(loadPage(page || 'trending'));
    }
  }
}

function loadPage(page) {
  return (dispatch, getState) => {
    switch(page) {
      case 'trending':
        store.dispatch(fetchTrendingVideos());
        break;
      case 'liked':
        store.dispatch(fetchLikedVideos());
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