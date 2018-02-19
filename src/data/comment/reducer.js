import entityReducer from '../entityReducer'

import {
  FETCH_COMMENTS_SUCCEEDED,
  CREATE_COMMENT_SUCCEEDED,
  UPDATE_COMMENT_SUCCEEDED,
  DELETE_COMMENT_SUCCEEDED
} from './actions'

const reducer = entityReducer({
  fetchActionType: FETCH_COMMENTS_SUCCEEDED,
  createActionType: CREATE_COMMENT_SUCCEEDED,
  updateActionType: UPDATE_COMMENT_SUCCEEDED,
  removeActionType: DELETE_COMMENT_SUCCEEDED
})

export default reducer