import axios from 'axios';

export const REQUEST_CATEGORY_GROUPS = 'REQUEST_CATEGORY_GROUPS';
export function requestCategoryGroups() {
  return { type: REQUEST_CATEGORY_GROUPS };
}

export const RECEIVE_CATEGORY_GROUPS = 'RECEIVE_CATEGORY_GROUPS';
export function receiveCategoryGroups(data) {
  return {
    type: RECEIVE_CATEGORY_GROUPS,
    categoryGroups: data,
    receivedAt: Date.now(),
  };
}

export function fetchCategoryGroups() {
  return function(dispatch) {
    dispatch(requestCategoryGroups());

    return axios.get('http://localhost:3000/category_groups')
      .then(response => dispatch(receiveCategoryGroups(response.data)));
  }
}
