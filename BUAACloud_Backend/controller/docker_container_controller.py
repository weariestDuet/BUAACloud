import flask
from utils.get_resp import get_resp
from services import docker_container_service
import time

docker_container_controller = flask.Blueprint('docker_container_controller', __name__)


# 获取容器列表，all=1时显示已停止容器
@docker_container_controller.route('/get_container_list', methods=['GET'])
def get_container_list():
    try:
        # 参数处理，是否显示全部
        _all = flask.request.args.get('all')
        if _all == "1":
            ret = docker_container_service.get_container_list(show_all=True)
            return get_resp(data=ret)
        else:
            ret = docker_container_service.get_container_list(show_all=True)
            return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=500)


# 运行容器，接受image_id，内部端口，协议，外部端口
@docker_container_controller.route('/run_container', methods=['GET'])
def run_container():
    try:
        # 检查request get参数完整性
        image_id = flask.request.args.get('image_id')
        if image_id is None:
            raise Exception('image_id is invalid!')
        internal_port = flask.request.args.get('internal_port')
        # 启动一个没有端口映射的容器
        if internal_port is None:
            pass  # 运行镜像，不检查端口占用情况
        protocol = flask.request.args.get('protocol')
        external_port = flask.request.args.get('external_port')
        name = flask.request.args.get('name')
        if name is None:
            name = 'noname_%s_%s_%s' % (image_id[0: 10], external_port, round(time.time()*1000))
            print(name)
        ret = docker_container_service.run_container(image_id=image_id, internal_port=internal_port, protocol=protocol, external_port=external_port, name=name)
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        get_resp(code=500, msg=e)


# 停止容器，接受container_id
@docker_container_controller.route('/stop_container', methods=['GET'])
def stop_container():
    try:
        container_id = flask.request.args.get('container_id')
        print(container_id)
        if container_id is None:
            raise Exception('container_id is invalid!')
        ret = docker_container_service.stop_container(container_id=container_id)
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


# 重启容器，接受container_id
@docker_container_controller.route('/restart_container', methods=['GET'])
def restart_container():
    try:
        container_id = flask.request.args.get('container_id')
        ret = docker_container_service.restart_container(container_id=container_id)
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=500)


# 删除容器，接受container_id
@docker_container_controller.route('/remove_container', methods=['GET'])
def remove_container():
    try:
        container_id = flask.request.args.get('container_id')
        if container_id is None:
            raise Exception('container_id is invalid!')
        ret = docker_container_service.remove_container(container_id=container_id)
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        get_resp(code=500)
