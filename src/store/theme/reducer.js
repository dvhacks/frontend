import * as types from './types'

const theme = (state = 'ics', action) => {
  switch (action.type) {
    case types.UPDATE_THEME:
      return action.theme;

    default:
      return state
  }
};

export default theme
