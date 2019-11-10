const initialState = {
  isDialogActive: false,
}

export default function (state = initialState, action) {
  switch (action.type) {

    case 'VALUES_CHANGED':
      return Object.assign({}, state, action.values);

    default:
      return state
  }
}
