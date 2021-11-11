import flask
import os
from werkzeug.utils import secure_filename
from utils.get_resp import get_resp
from services import docker_build_service
from orm.connect_sqlite3 import connect_db, fetch_all

docker_build_controller = flask.Blueprint('docker_build_controller', __name__)


# 获取构建项目文件夹
@docker_build_controller.route("/get_build_projects")
def get_build_projects():
    try:
        result = []
        dirs = docker_build_service.scan_build_projects_dirs()
        conn = connect_db()
        for i in dirs:
            cur = conn.cursor().execute('select * from build_table where dir_name="%s"' % i.get('dir_name'))
            rv = fetch_all(cur, one=True)
            print('>>>', rv)
            if rv:
                result.append({
                    'id': rv.get('id'),
                    'dir_name': i.get('dir_name'),
                    'files_size': i.get('files_size'),
                    'image_name': rv.get('image_name'),
                    'image_tag': rv.get('image_tag'),
                    'create_time': rv.get('create_time'),
                    'last_time': rv.get('last_time')
                })
        conn.close()
        return get_resp(data=result)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


# 增加构建项目文件夹
@docker_build_controller.route("/new_build_project", methods=['GET'])
def new_build_project():
    try:
        dir_name = flask.request.args.get('dir_name')
        flag = docker_build_service.new_dir_to_build_projects(dir_name)
        return get_resp(data=flag)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)
