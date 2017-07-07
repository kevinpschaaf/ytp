export function toastInfo(info = {showing: false, text: ''}, action) {
  switch (action.type) {
    case 'SHOW_TOAST':
      return {...info, showing: true, text: action.text}
    case 'HIDE_TOAST':
      return {...info, showing: false}
    default:
      return info;
  }
}
