export function likedVideos(likedVideos = {}, action) {
  switch (action.type) {
    case 'LIKED_VIDEOS_REQUESTED':
      return {...likedVideos, loading: true};
    case 'LIKED_VIDEOS_RECEIVED':
      return {...likedVideos, loading: false, items: action.items.map(i => i.id)};
    case 'VIDEO_RATING_CHANGED':
      const {items} = likedVideos;
      const idx = items && items.indexOf(action.id);
      if (idx >= 0 && action.myRating != 'like') {
        return {...likedVideos, items: [...items.slice(0,idx), ...items.slice(idx+1)]};
      } else if (idx < 0 && action.myRating == 'like') {
        return {...likedVideos, items: items.concat([action.id])};
      } else {
        return likedVideos;
      }
    case 'USER_LOGGED_OUT':
      return [];
    default:
      return likedVideos;
  }
}
