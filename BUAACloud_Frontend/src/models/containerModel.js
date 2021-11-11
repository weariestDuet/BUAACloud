import * as requestService from '../services/requestService';
import { isArray, updateKeyToObjArray } from '@/utils/formatData';
import { isResp200 } from '@/utils/checkResp';
import { message } from 'antd';

export default {
  namespace: 'containerModel',
  state: {
    containerList: [],
  },
  reducers: {

    containerList(state, {payload}) {
      return { ...state, containerList: payload }
    }

  },
  effects: {

    // 获取容器列表
    *getContainerList({ payload }, { call, put }) {
      try {
        const resp = yield call(requestService.getContainerList, payload);
        if (isResp200(resp) && isArray(resp.data.data)) {
          const ret = updateKeyToObjArray(resp);
          yield put({ type: 'containerList', payload: ret });
        }
      } catch (e) {
        console.log(e)
      }
    },

    //停止容器
    *stopContainer({payload}, {call, put}) {
      try {
        const resp = yield call(requestService.stopContainer, payload);
        if (isResp200(resp)) {
          message.success(`已停止运行容器「${record.container_id}」`);
        }
      } catch (e) {
        console.log(e)
      } finally {
        yield put({type: 'getContainerList'})
      }
    },

    //删除容器
    *removeContainer({payload}, {call, put}) {
      try {
        const resp = yield call(requestService.removeContainer, payload);
        if (isResp200(resp)) {
          message.success(`已删除容器「${record.container_id}」`);
        }
      } catch (e) {
        console.log(e)
      } finally {
        yield put({type: 'getContainerList'})
      }
    },

    //重启容器
    *restartContainer({payload}, {call, put}) {
      try {
        const resp = yield call(requestService.restartContainer, payload);
        if (isResp200(resp)) {
          message.success(`已重启容器「${record.container_id}」`);
        }
      } catch (e) {
        console.log(e)
      } finally {
        yield put({type: 'getContainerList'})
      }
    },
    
  }
}
