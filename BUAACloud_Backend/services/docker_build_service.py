import os


BUILD_PROJECTS_PATH = os.path.join(os.path.dirname(__file__).replace('services', ''), 'files', 'build_projects')


def scan_build_projects_dirs():
    result = []
    listdir = os.listdir(BUILD_PROJECTS_PATH)
    for i in listdir:
        target = os.path.join(BUILD_PROJECTS_PATH, i)
        size = os.path.getsize(target)
        result.append({'dir_name': i, 'files_size': size})
    print(result)
    return result


def new_dir_to_build_projects(dir_name):
    target = os.path.join(BUILD_PROJECTS_PATH, dir_name)
    if os.path.exists(target):
        return False
    os.mkdir(target)
    return True


def delete_dir_to_build_projects(dir_name):
    target = os.path.join(BUILD_PROJECTS_PATH, dir_name)
    if not os.path.exists(target):
        return False
    os.removedirs(target)
    return True


if __name__ == '__main__':
    scan_build_projects_dirs()
    # new_dir_to_build_projects('demo-04')
    print(delete_dir_to_build_projects('demo-04'))
