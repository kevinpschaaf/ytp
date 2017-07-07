export function trendingVideos(trendingVideos = {}, action) {
  switch (action.type) {
    case 'TRENDING_VIDEOS_SET':
      return {...trendingVideos, items: action.items};
    case 'TRENDING_VIDEOS_LOADING_SET':
      return {...trendingVideos, loading: action.loading};
    default:
      return trendingVideos;
  }
}
