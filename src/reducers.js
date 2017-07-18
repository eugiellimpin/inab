import { combineReducers } from 'redux';
import {
  REQUEST_CATEGORY_GROUPS,
  RECEIVE_CATEGORY_GROUPS,
} from './actions';

function rootReducer(
  state = {
    isFetching: false,
    didInvalidate: false,
    categoryGroups: [],
  },
  action
) {
  switch(action.type) {
    // case INVALIDATE_CATEGORY_GROUPS:
    case REQUEST_CATEGORY_GROUPS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case RECEIVE_CATEGORY_GROUPS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        categoryGroups: action.categoryGroups,
        lastUpdated: action.receivedAt,
      })
    default:
      return state;
  }
}

export default rootReducer;
