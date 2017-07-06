export function addVideos(items) {
  return {
    type: 'VIDEOS_ADD',
    items: items.reduce((p,n) => { return p[n.id] = n, p}, {})
  }
}
