import { getUser } from '@/services';

export default {
  namespace: 'user',
  state: {
    userInfo: '',
  },
  effects: {
    * getUser({ payload }, { call, put }) {
      /* put方法触发一个reducer */
      const { token } = payload;

      const { data, status } = yield call(getUser, token);
      if(status === 200) {
        yield put({
          type: "save",
          payload: {
            userInfo: data
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
  },
};
