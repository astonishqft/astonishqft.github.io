import { getUser, githubAuth } from '@/services';

export default {
  namespace: 'user',
  state: {
    userInfo: {},
  },
  effects: {
    * githubAuth({ payload }, { call, put }) {
      const { githubAuthCode } = payload;
      const { data: { data = {} } } = yield call(githubAuth, githubAuthCode);
      if(data.error) {
        return false;
      } else {
        return data.access_token;
      }
    },
    * getUser({ payload }, { call, put }) {
      const { token } = payload;

      const { data, status } = yield call(getUser, token);
      if(status === 200) {
        yield put({
          type: "save",
          payload: {
            userInfo: { ...data, isLogin: true }
          },
        });
      }
    },
  },
  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    clear: (state, { payload }) => ({
      ...state,
      userInfo: {},
    }),
  },
};
