export function toastInfo(info = {showing: false, text: ''}, action) {
  switch (action.type) {
    case 'TOAST_REQUESTED':
      return {...info, showing: true, text: action.text}
    case 'TOAST_DISMISSED':
      return {...info, showing: false}
    default:
      return info;
  }
}
