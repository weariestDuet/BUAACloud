import request from 'axios';
import { API } from '../config/apiConfig';
import { parseParams } from '../utils/formatData';

/**
 * 封装异步请求接口实现
 **/

// request.defaults.withCredentials = true;
request.defaults.crossDomain = true;

// 获取 docker 镜像列表
export function getDockerImageList() {
  const url = `${API}/docker_image/get_image_list`;
  return request.get(url)
}

// 上传镜像文件
export function uploadImageFile(payload) {
  const url = `${API}/docker_image/upload_image_file`;
  return request({
    url,
    method: 'POST',
    data: payload
  })
}

// 删除镜像
export function removeImage(payload) {
  const url = `${API}/docker_image/remove_image`;
  return request.get(url, {
    params: payload
  })
}

// 保存镜像
export function saveImage(payload) {
  const url = `${API}/docker_image/save_image?image_id=${payload.image_id}&image_name=${payload.image_name}&image_tag=${payload.image_tag}`;
  const ele = document.createElement('a');
  ele.href = url;
  ele.target = '_blank';
  document.body.append(ele);
  ele.click();
  ele.remove();
}

// 获取容器列表
export function getContainerList(payload) {
  const url = `${API}/docker_container/get_container_list`;
  return request.get(url, {
    params: payload
  })
}

//停止运行容器
export function stopContainer(payload) {
  const url = `${API}/docker_container/stop_container`;
  return request.get(url, {
    params: payload
  })
}

//重启容器
export function restartContainer(payload) {
  const url = `${API}/docker_container/restart_container`;
  return request.get(url, {
    params: payload
  })
}
//删除容器
export function removeContainer(payload) {
  const url = `${API}/docker_container/remove_container`;
  return request.get(url, {
    params: payload
  })
}
// 获取构建列表
export function getBuildProjects(payload) {
  const url = `${API}/docker_build/get_build_projects`;
  return request.get(url, {
    params: payload
  })
}
