export function likedVideos(likedVideos = {}, action) {
  switch (action.type) {
    case 'LIKED_VIDEOS_SET':
      return {...likedVideos, items: action.items};
    case 'LIKED_VIDEOS_LOADING_SET':
      return {...likedVideos, loading: action.loading};
    case 'VIDEO_MY_RATING_SET':
      const {items} = likedVideos;
      const idx = items && items.indexOf(action.id);
      if (idx >= 0 && action.myRating != 'like') {
        return {...likedVideos, items: [...items.slice(0,idx), ...items.slice(idx+1)]};
      } else if (idx < 0 && action.myRating == 'like') {
        return {...likedVideos, items: items.concat([action.id])};
      } else {
        return likedVideos;
      }
    case 'SET_USER':
      return action.user ? likedVideos : [];
    default:
      return likedVideos;
  }
}
