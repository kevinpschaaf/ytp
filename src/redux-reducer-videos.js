export function videos(videos = {}, action) {
  switch (action.type) {
    case 'TRENDING_VIDEOS_RECEIVED':
    case 'LIKED_VIDEOS_RECEIVED':
      return {...videos, ...action.items.reduce((p,n) => (p[n.id] = n, p), {})};
    case 'VIDEO_RATINGS_RECEIVED':
      return {
        ...videos,
        ...action.ratings.map(r => ({...videos[r.id], myRating: r.myRating})).
          reduce((p,n) => (p[n.id] = n, p), {})
      };
    case 'VIDEO_RATING_CHANGED':
      return {...videos, [action.id]: {...videos[action.id], myRating: action.myRating}}
    default:
      return videos;
  }
}
