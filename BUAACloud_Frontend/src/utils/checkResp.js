import { message } from 'antd';


export function isResp200(resp) {
  if (resp.status === 200 && resp.data.code === 200) return true;
  else if (resp.status === 200) {
    message.error("发生了一点意外，请稍后");
    return false
  } else {
    message.error("网络错误，请检查网络设置")
    return false
  }
}

// test object is Array ? true : false
export function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}
