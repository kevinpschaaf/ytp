export function videos(videos = {}, action) {
  switch (action.type) {
    case 'VIDEOS_ADD':
      return {...videos, ...action.items};
    case 'VIDEO_MY_RATING_SET':
      return {...videos, [action.id]: {...videos[action.id], myRating: action.myRating}}
    default:
      return videos;
  }
}
