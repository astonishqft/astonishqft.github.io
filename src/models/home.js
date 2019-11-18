import {
  getCommentByIssueId,
  createComment,
  getIssueDetail,
  createReaction,
} from '@/services';

import { message } from 'antd';

export default {
  namespace: 'home',
  state: {
    commentList: [],
    issueDetail: ''
  },
  effects: {
    * getCommentList({ payload }, { call, put }) {
      const { id } = payload;
      const { data, status } = yield call(getCommentByIssueId, id);
      if (status === 200) {
        yield put({
          type: "save",
          payload: {
            commentList: data
          },
        });
      }
    },

    * getIssueDetail({ payload }, { call, put }) {
      /* put方法触发一个reducer */
      const { id } = payload;

      const { data, status } = yield call(getIssueDetail, id);
      if (status === 200) {
        yield put({
          type: "save",
          payload: {
            issueDetail: data
          },
        });
      }
    },

    * createComment({ payload }, { call, put }) {
      const { id, value } = payload;
      const { status } = yield call(createComment, id, value);
      debugger
      if (status === 201) {
        yield put({
          type: "getCommentList",
          payload: {
            id
          },
        });
        message.success('添加成功')
      }
    },

    * createReaction({ payload }, { call, put }) {
      const { commentId, issueId, type } = payload;
      const { status } = yield call(createReaction, commentId, type);
      if ([200, 201].includes(status)) {
        yield put({
          type: "getCommentList",
          payload: {
            id: issueId,
          },
        });
        // message.success('添加成功')
      }
    },
  },
  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload
    }),
  },
};
