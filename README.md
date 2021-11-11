# Docker管理器中间件

项目名称：Docker-Manager-Middleware（Docker管理器中间件）

作用：基于Docker api实现RESTFul API，作为中间件供上层调用

**本仓库包含了前后端工程**

## Backend / 目录结构

1. controller：API响应
2. files：上传下载的工作目录
3. orm：处理数据库连接、docker连接的中间件
4. services：实现docker api操作
5. static：放静态文件
6. templates：放静态模板文件
7. utils：公共库
8. app.py：main函数
9. config.ini：配置文件

## Backend 接口列表

**1 镜像相关**

获取镜像列表：

`/docker_image/get_image_list`

拉取镜像：

`/docker_image/pull_image?image_name=nginx&image_tag=latest`

保存镜像：

`/docker_image/save_image?image_id=nginx`

删除镜像：

`/docker_image/remove_image?image_name=nginx`

**2 容器相关**

获取容器列表：

`/docker_container/get_container_list?all=1`

运行容器：

`/docker_container/run_container?image_id=123&internal_port=80&protocol=tcp&external_port=8080`

停止容器：

`/docker_container/stop_container?container_id=`

重启容器：

`/docker_container/restart_container?container_id=`

删除容器：

`/docker_container/remove_container?container_id=`

**3 构建相关**

None，还没有完全实现

## Frontend /src 目录结构

1. component：非页面级的React组件，例如对话框
2. config：组件的配置文件，与界面、请求有关
3. layouts：公共样式，公共组件，头尾导航栏
4. models：所有react-redux用的model，使数据发生变化，被其他React组件引用
5. pages：页面级的React组件，例如主界面
6. services：ajax请求方法实现，纯函数
7. utils：公共库，校验resp数据，格式化post数据
