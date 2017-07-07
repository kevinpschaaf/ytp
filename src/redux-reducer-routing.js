export function currentPage(page = null, action) {
  switch (action.type) {
    case 'CHANGE_PAGE':
      return action.page;
    default:
      return page;
  }
}
