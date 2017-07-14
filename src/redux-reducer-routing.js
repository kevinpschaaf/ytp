export function currentPage(page = null, action) {
  switch (action.type) {
    case 'PAGE_CHANGED':
      return action.page;
    default:
      return page;
  }
}
