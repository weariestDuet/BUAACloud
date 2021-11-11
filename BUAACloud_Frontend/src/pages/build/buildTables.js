import React from 'react';
import { connect } from 'umi';
import { Button, Input, Popconfirm, Table, Tooltip, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import style from './buildTables.less';
import NewBuildTaskModal from './newBuildTaskModal';

class BuildTables extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 55,
        render: text => <span>{text + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'dir_name',
        key: 'dir_name',
        width: 200,
      },
      {
        title: '文件数量',
        dataIndex: 'file_count',
        key: 'file_count',
        width: 200,
      },
      {
        title: '文件大小',
        dataIndex: 'files_size',
        key: 'files_size',
        width: 120,
        // render: text => <span>{(Number(text) / 1000000).toFixed(2)}MB</span>
      },
      {
        title: '目标镜像名称',
        dataIndex: 'image_name',
        key: 'image_name',
        width: 200,
      },
      {
        title: '目标镜像版本',
        dataIndex: 'image_tag',
        key: 'image_tag',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 200,
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '上次构建时间',
        dataIndex: 'last_time',
        key: 'last_time',
        width: 200,
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: record => <div>
          <Button type='link'>立即构建</Button>
          <Button type='link'>更改</Button>
          <Popconfirm title={`确认删除镜像「${record?.image_name}:${record?.image_tag}」吗？`}
                      onConfirm={this.onDelete.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link' style={{color: 'red'}}>删除</Button>
          </Popconfirm>
        </div>
      }
    ];
    this.state = {
      dataLoading: false,
      tableWidth: 'max-content',
      newBuildTaskModalVisible: false,
    };
  }

  // handle
  newBuildTaskModalVisible = () => {
    this.setState({ newBuildTaskModalVisible: true })
  }
  newBuildTaskModalHide = () => {
    this.setState({ newBuildTaskModalVisible: false })
  }

  onDelete = async record => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({type: 'globalModel/removeImage', payload: { image_name: record.image_name, image_tag: record.image_tag, image_id: record.image_id } })
    message.success(`已删除镜像「${record.image_name}:${record.image_tag}」`)
    await this.setState({ dataLoading: false });
  }

  onSave = async record => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({type: 'globalModel/saveImage', payload: { image_name: record.image_name, image_tag: record.image_tag, image_id: record.image_id } })
    await this.setState({ dataLoading: false });
  }

  initData = async () => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({ type: 'buildModel/getBuildProjects'});
    await this.setState({ dataLoading: false });
  }

  componentWillMount() {
    this.initData().then()
  }

  render() {

    const renderActionBar = () => {
      return <div className={style.action_bar_box}>
        <Button className={style.action_bar_btn} type="primary" size="small" onClick={this.newBuildTaskModalVisible} icon={<action />}>新建构建任务</Button>
      </div>
    }

    const renderTable = () => {
      return <Table columns={this.columns}
                    dataSource={this.props.buildProjects}
        // scroll={{x: this.state.tableWidth}}
                    loading={this.state.dataLoading}
                    bordered
                    sticky
      />
    }

    return <div>
      { renderActionBar() }
      { renderTable() }
      <NewBuildTaskModal visible={this.state.newBuildTaskModalVisible} hide={this.newBuildTaskModalHide} />
      {/*<UploadImageModal visible={this.state.uploadModalVisible} hide={this.uploadModalHide}/>*/}
      {/*<ContainerRun visible={this.state.containerRunModalVisible} hide={this.containerRunModalHide}/>*/}
    </div>
  }

}

function mapStateToProps(state) {
  const { buildProjects } = state.buildModel;
  return { buildProjects };
}

export default connect(mapStateToProps)(BuildTables)
