from orm.docker_client import docker_client
import re
import os
from werkzeug.utils import secure_filename


def get_image_list():
    ret = []
    image_list = docker_client.images.list()
    for i in image_list:
        image_id, image_name, image_tag, image_size = '', '', '', ''

        # get image id
        _regex_result = re.findall('^sha256:(.*?)$', i.attrs.get('Id'))
        if len(_regex_result) != 0:
            image_id = _regex_result[0]

        # get image size
        image_size = i.attrs.get('Size')

        # get image name and tags
        _repo_tags = i.attrs.get('RepoTags')
        for j in _repo_tags:
            _regex_result = re.findall('^(.*?):(.*?)$', j)
            if len(_regex_result) != 0:
                image_name = _regex_result[0][0]
                image_tag = _regex_result[0][1]
            # output result
            ret.append({'image_id': image_id, 'image_name': image_name, 'image_tag': image_tag, 'image_size': image_size})
    return ret


# services, dependence by ``docker_container_list`` function
def get_image_by_name(name):
    try:
        ret = []
        image_id, image_name, image_tag = '', '', ''
        # get image
        image = docker_client.images.get(name)
        # parse image id
        _regex_result = re.findall('^sha256:(.*?)$', image.attrs.get('Id'))
        if len(_regex_result) != 0:
            image_id = _regex_result[0]
        # parse image name and tags
        for tag in image.attrs.get('RepoTags'):
            _regex_result = re.findall('^(.*?):(.*?)$', tag)
            if len(_regex_result) != 0:
                image_name = _regex_result[0][0]
                image_tag = _regex_result[0][1]
            # get result list
            ret.append({'image_id': image_id, 'image_name': image_name, 'image_tag': image_tag})
        return ret
    except Exception as e:
        print(e)
        raise Exception(e)


def pull_image(image_name, image_tag):
    try:
        return docker_client.images.pull(repository=image_name, tag=image_tag)
    except Exception as e:
        print(e)
        raise Exception(e)


def load_image(file_path, re_name=None, re_tag=None):
    try:
        fp = open(file=file_path, mode='rb')
        result = docker_client.images.load(data=fp)
        fp.close()
        print(result)
        return 'ok'
    except Exception as e:
        print(e)
        raise Exception(e)


def get_tarball_filename(image_name=None, image_tag=None, image_id=None):
    try:
        if image_name is not None and image_tag is not None:
            image = docker_client.images.get(name=image_name + ':' + image_tag)
        elif image_id is not None:
            image = docker_client.images.get(name=image_id)
        else:
            raise Exception('can not found target image!')
        # image对象的tags是list，例如['demo-20:0.1']，取list的第一项作为filename，拼合image_id作为文件名
        filename = str([i for i in image.tags][0] + '_' + image.attrs.get('Id')[7:17]).replace(':', '_') + '.tar'
        return filename
    except Exception as e:
        print(e)
        raise Exception(e)


def save_image(image_name=None, image_tag=None, image_id=None):
    try:
        if image_name is not None and image_tag is not None:
            image = docker_client.images.get(name=image_name + ':' + image_tag)
        elif image_id is not None:
            image = docker_client.images.get(name=image_id)
        else:
            raise Exception('can not found target image!')
        # image对象的tags是list，例如['demo-20:0.1']，取list的第一项作为filename，拼合image_id作为文件名
        filename = str([i for i in image.tags][0] + '_' + image.attrs.get('Id')[7:17]).replace(':', '_') + '.tar'
        for chunk in image.save(named=True):
            yield chunk
    except Exception as e:
        print(e)
        raise Exception(e)


def remove_image(image_name=None, image_tag=None, image_id=None):
    try:
        ret = None
        if image_name is not None and image_tag is not None:
            ret = docker_client.images.remove(image=image_name + ':' + image_tag)
        elif image_id is not None:
            ret = docker_client.images.remove(image=image_id)
        return ret
    except Exception as e:
        print(e)
        raise Exception(e)


def build_image(image_name=None, image_tag=None, image_id=None):
    try:
        ret = None
        base_path = os.path.dirname(__file__)  # 当前py文件的路径
        dockerfile_path = os.path.join(base_path.replace('services', ''), 'files\dockerfiles', secure_filename('dockerfile'))
        print(dockerfile_path)
        dockerfile = open(dockerfile_path, mode='rb')
        context_path = os.path.join(base_path.replace('services', ''), 'files\dockerfiles')
        print(context_path)
        ret = docker_client.images.build(path=context_path, tag='java-demo:0.0.2', quiet=False)
        for i in ret:
            print(i)
        for i in ret[1]:
            print(i)
    except Exception as e:
        print(e)
        raise Exception(e)


