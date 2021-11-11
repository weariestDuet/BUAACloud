import * as requestService from '../services/requestService';
import { isArray, updateKeyToObjArray } from '@/utils/formatData';
import { isResp200 } from '@/utils/checkResp';
import { message } from 'antd';

export default {
  namespace: 'buildModel',
  state: {
    buildProjects: []
  },
  reducers: {

    buildProjects(state, {payload}) {
      return { ...state, buildProjects: payload }
    }

  },
  effects: {

    // 获取 docker 镜像列表
    *getBuildProjects({ payload }, { call, put }) {
      try {
        const resp = yield call(requestService.getBuildProjects, payload);
        console.log(resp)
        if (isResp200(resp) && isArray(resp.data.data)) {
          const ret = updateKeyToObjArray(resp);
          yield put({ type: 'buildProjects', payload: ret });
        }
      } catch (e) {
        console.log(e)
      }
    },

  },
  subscriptions: {}
}
