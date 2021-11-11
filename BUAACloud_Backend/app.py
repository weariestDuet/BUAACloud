import flask
from utils.get_resp import get_resp
# docker client
from orm.docker_client import docker_client
# 定时调度器
from flask_apscheduler import APScheduler
from services.interval_task import job_1
# blueprint
from controller.docker_image_controller import docker_image_controller
from controller.docker_container_controller import docker_container_controller
from controller.docker_build_controller import docker_build_controller


class Config(object):
    JOBS = [
        {
            'id': 'job1',
            'func': 'app:job_1',
            'args': '',
            'trigger': 'interval',
            'seconds': 60
        }
    ]

    SCHEDULER_API_ENABLED = False


app = flask.Flask(__name__)
app.register_blueprint(docker_image_controller, url_prefix='/docker_image')
app.register_blueprint(docker_container_controller, url_prefix='/docker_container')
app.register_blueprint(docker_build_controller, url_prefix='/docker_build')


@app.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin'] = '*'
    environ.headers['Access-Control-Allow-Method'] = '*'
    # environ.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    # environ.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return environ


@app.route('/')
def hello_world():
    str1 = 'the server is running, power by python flask!'
    return get_resp(data=str1)


@app.route('/hello_world')
def docker_hello_world():
    std_out = docker_client.containers.run(image='hello-world')
    print(std_out)
    return str(std_out.decode('utf-8'))


def test_svc():
    try:
        raise Exception('error')
    except Exception as e:
        raise Exception(e)


@app.route('/test')
def test():
    try:
        result = test_svc()
        return get_resp(data=result)
    except Exception as e:
        print(e)
        return get_resp(code=500, msg=e)


if __name__ == '__main__':
    app.config.from_object(Config())
    # scheduler = APScheduler()
    # scheduler.init_app(app)
    # scheduler.start()
    app.run(host='localhost', port=5001, debug=True, threaded=True)
