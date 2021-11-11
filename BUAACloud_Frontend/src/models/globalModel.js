import * as requestService from '../services/requestService';
import { isArray, updateKeyToObjArray } from '@/utils/formatData';
import { isResp200 } from '@/utils/checkResp';
import { message } from 'antd';

export default {
  namespace: 'globalModel',
  state: {
    dockerImageList: []
  },
  reducers: {

    dockerImageList(state, {payload}) {
      return { ...state, dockerImageList: payload }
    }

  },
  effects: {

    // 获取 docker 镜像列表
    *getDockerImageList({ payload }, { call, put }) {
      try {
        const resp = yield call(requestService.getDockerImageList);
        console.log(resp)
        if (isResp200(resp) && isArray(resp.data.data)) {
          const ret = updateKeyToObjArray(resp);
          yield put({ type: 'dockerImageList', payload: ret });
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 上传镜像文件
    *uploadImageFile({payload}, {call, put}) {
      try {
        const resp = yield call(requestService.uploadImageFile, payload);
        if (isResp200(resp)) {
          message.success(`上传镜像文件成功`, 2)
        } else if (resp.status === 200 && resp.data.code === 500) {
          message.warning(resp.data.msg, 2)
        } else {
          message.error(`上传镜像文件失败`, 2)
        }
      } catch (e) {
        console.log(e)
      } finally {
        yield put({type: 'getDockerImageList'})
      }
    },

    // 删除镜像
    *removeImage({payload}, {call, put}) {
      try {
        const resp = yield call(requestService.removeImage, payload);
        if (isResp200(resp)) {
          // message.success(`已删除镜像「${payload.image_name}:${payload.image_tag}」`, 2);
        }
      } catch (e) {
        console.log(e)
      } finally {
        yield put({type: 'getDockerImageList'})
      }
    },

    // 保存镜像
    *saveImage({payload}, {call, put}) {
      try {
        const res = yield call(requestService.saveImage, payload);
        if (isResp200(res)) {
          message.success(`已开始下载「${payload.image_name}:${payload.image_tag}」`, 2);
        }
      } catch (e) {
        console.log(e)
      }
    }

  },
  subscriptions: {}
}
