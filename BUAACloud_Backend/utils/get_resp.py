from flask import jsonify


def get_resp(data=None, code=None, msg=None):
    if code is None:
        code = 200
    if msg is None:
        if code == 200:
            msg = '请求成功'
        elif 400 <= code <= 499:
            msg = '数据未找到'
        elif 500 <= code <= 599:
            msg = '参数错误'
    # if not isinstance(data, (int, float, str, list, tuple, dict)):
    #     data = str(data)
    return jsonify({'code': code, 'msg': str(msg), 'data': data})
