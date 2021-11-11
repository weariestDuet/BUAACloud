// test object is Array ? true : false
export function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

// 向 key-value 的 array 添加 key 键
export function updateKeyToObjArray(res) {
  if (!isArray(res.data.data)) return null;
  let retList = [];
  res.data.data.forEach((each, index) => {
    each.key = index;
    retList.push(each)
  });
  return retList;
}

// parse json object to url encode string, order to post data
export function parseParams(data) {
  try {
    let tempArr = [];
    for (let i in data) {
      const key = encodeURIComponent(i);
      const value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    return tempArr.join('&');
  } catch (err) {
    return null;
  }
}

// This function returns a promise object.
// This promise object will be resolved after the delay ends by setTimeout.
// Calling this function needs to combine async / await to achieve the blocking delay effect.
export const delay = timeoutMS => new Promise((resolve) => {
  setTimeout(resolve, timeoutMS);
});
