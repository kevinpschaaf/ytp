export function trendingVideos(trendingVideos = {}, action) {
  switch (action.type) {
    case 'TRENDING_VIDEOS_REQUESTED':
      return {...trendingVideos, loading: true};
    case 'TRENDING_VIDEOS_RECEIVED':
      return {...trendingVideos, loading: false, items: action.items.map(i => i.id)};
    default:
      return trendingVideos;
  }
}
