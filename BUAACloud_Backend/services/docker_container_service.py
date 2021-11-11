from orm.docker_client import docker_client
import re
from services.docker_image_service import get_image_by_name, get_image_list


def get_container_list(show_all=False):
    ret = []
    try:
        container_list = docker_client.containers.list(all=show_all)
        for i in container_list:
            image_list, container_id, container_name, create_time, state, network = None, None, None, None, None, None
            # 获取container所属image
            print(i.attrs)
            _regex_result = re.findall('^sha256:(.*?)$', i.attrs.get('Image'))
            if len(_regex_result) != 0:
                image_id = _regex_result[0]
                image_list = get_image_by_name(image_id)
            # 获取container的其他信息
            container_id = i.attrs.get('Id')
            container_name = i.attrs.get('Name')
            create_time = i.attrs.get('Created')
            state = i.attrs.get('State')
            network = i.attrs.get('NetworkSettings')
            ret.append({'image_list': image_list, 'container_id': container_id, 'container_name': container_name,
                        'create_time': create_time, 'state': state, 'network': network})
        return ret
    except Exception as e:
        print(e)
        raise Exception(e)


def run_container(image_id, internal_port, protocol, external_port, name):
    try:
        # check for duplicates container from the same image_id
        container_list = get_container_list(show_all=True)
        for i in container_list:
            print('container:', i, '\n\n')
            # if duplicates, stop it
            if image_id in str(i.get('image_list')):
                print('exits a container %s from the same image %s, stop it and restart...' % (
                i.get('container_id')[0:10], image_id[0:10]))
                docker_client.api.stop(i.get('container_id'))

        # config port tunnel
        ports_config = {}
        ports_config.update({'%s/%s' %(internal_port, protocol): '%s' % external_port})
        container_obj = docker_client.containers.run(image=image_id, auto_remove=True, detach=True, ports=ports_config, name=name)
        return container_obj.attrs
    except Exception as e:
        print(e)
        raise Exception(e)


def stop_container(container_id):
    try:
        return docker_client.api.stop(container_id)
    except Exception as e:
        print(e)
        raise Exception(e)


def restart_container(container_id):
    try:
        return docker_client.api.restart(container_id)
    except Exception as e:
        print(e)
        raise Exception(e)


def remove_container(container_id):
    try:
        return docker_client.api.remove_container(container_id)
    except Exception as e:
        print(e)
        raise Exception(e)
