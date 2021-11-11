import os
from werkzeug.utils import secure_filename

import flask
from utils.get_resp import get_resp
from services import docker_image_service

docker_image_controller = flask.Blueprint('docker_image_controller', __name__)


# 获取镜像列表
@docker_image_controller.route("/get_image_list")
def get_image_list():
    try:
        ret = docker_image_service.get_image_list()
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=404)


# 拉取镜像（默认从docker-hub仓库）
@docker_image_controller.route('/pull_image', methods=['GET'])
def pull_image():
    try:
        image_name = flask.request.args.get('image_name')
        image_tag = flask.request.args.get('image_tag')
        ret = docker_image_service.pull_image(image_name=image_name, image_tag=image_tag)
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=404)


# 加载镜像（从tar格式文件load镜像）
@docker_image_controller.route('/load_image', methods=['GET'])
def load_image():
    try:
        file_path = flask.request.args.get('file_path')
        result = docker_image_service.load_image(file_path=file_path)
        return get_resp(data=result)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


# 保存镜像，参数：image_name，可传递image_id
@docker_image_controller.route('/save_image', methods=['GET'])
def save_image():
    try:
        image_name = flask.request.args.get('image_name')
        image_tag = flask.request.args.get('image_tag')
        image_id = flask.request.args.get('image_id')
        filename = docker_image_service.get_tarball_filename(image_name=image_name, image_tag=image_tag, image_id=image_id)
        headers = {"Content-disposition": "attachment; filename="+filename}
        return flask.Response(docker_image_service.save_image(image_name=image_name, image_tag=image_tag, image_id=image_id), mimetype='application/x-tar', content_type='application/x-tar', headers=headers)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


# 删除镜像
@docker_image_controller.route('/remove_image', methods=['GET'])
def remove_image():
    try:
        image_name = flask.request.args.get('image_name')
        image_tag = flask.request.args.get('image_tag')
        image_id = flask.request.args.get('image_id')
        ret = docker_image_service.remove_image(image_name=image_name, image_tag=image_tag, image_id=image_id)
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


# 上传镜像文件到本地文件夹
@docker_image_controller.route('/upload_image_file', methods=['POST'])
def upload_image_file():
    try:
        f = flask.request.files['tar']
        print(f.filename, f)
        base_path = os.path.dirname(__file__)  # 当前py文件的路径
        upload_path = os.path.join(base_path.replace('controller', ''), 'files/upload_folder', secure_filename(f.filename))
        f.save(upload_path)
        result = docker_image_service.load_image(file_path=upload_path)
        return get_resp(data=result)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


# docker build 构建镜像
@docker_image_controller.route('/build_image', methods=['GET'])
def build_image():
    try:
        ret = docker_image_service.build_image()
        return get_resp(data=ret)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)
