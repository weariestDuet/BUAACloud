import React from 'react';
import { connect } from 'umi';
import { Button, Input, Popconfirm, Table, Tooltip, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import style from './imageTable.less';
import UploadImageModal from './uploadImageModal';
import ContainerRun from '../../component/containerRunModal';

class ImageTable extends React.Component {
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
        title: '镜像名称',
        dataIndex: 'image_name',
        key: 'image_name',
        width: 200,
      },
      {
        title: '镜像标签',
        dataIndex: 'image_tag',
        key: 'image_tag',
        width: 200,
      },
      {
        title: '镜像大小',
        dataIndex: 'image_size',
        key: 'image_size',
        width: 120,
        render: text => <span>{(Number(text) / 1000000).toFixed(2)}MB</span>
      },
      {
        title: '镜像ID',
        dataIndex: 'image_id',
        key: 'image_id',
        width: 120,
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement='topLeft' title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: record => <div>
          <Button type='link' onClick={this.containerRunModalVisible.bind(this, record)}>运行容器</Button>
          <Button type='link' onClick={this.onSave.bind(this, record)}>保存镜像</Button>
          <Popconfirm title={`确认删除镜像「${record?.image_name}:${record?.image_tag}」吗？`}
                      onConfirm={this.onDelete.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link' style={{color: 'red'}}>删除镜像</Button>
          </Popconfirm>
        </div>
      }
    ];
    this.state = {
      dataLoading: false,
      tableWidth: 'max-content',
      uploadModalVisible: false,
      containerRunModalVisible: false,
    };
  }

  // handle
  uploadModalVisible = () => {
    this.setState({ uploadModalVisible: true })
  }
  uploadModalHide = () => {
    this.setState({ uploadModalVisible: false })
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

  containerRunModalVisible = () => {
    this.setState({ containerRunModalVisible: true })
  }
  containerRunModalHide = () => {
    this.setState({ containerRunModalVisible: false })
  }

  initData = async () => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({ type: 'globalModel/getDockerImageList'});
    await this.setState({ dataLoading: false });
  }

  componentWillMount() {
    this.initData().then()
  }

  render() {

    const renderActionBar = () => {
      return <div className={style.action_bar_box}>
        <Button className={style.action_bar_btn} type="primary" size="small" onClick={this.uploadModalVisible} icon={<action />}>上传镜像</Button>
      </div>
    }

    const renderTable = () => {
      return <Table columns={this.columns}
                    dataSource={this.props.dockerImageList}
        // scroll={{x: this.state.tableWidth}}
                    loading={this.state.dataLoading}
                    bordered
                    sticky
      />
    }

    return <div>
      { renderActionBar() }
      { renderTable() }
      <UploadImageModal visible={this.state.uploadModalVisible} hide={this.uploadModalHide}/>
      <ContainerRun visible={this.state.containerRunModalVisible} hide={this.containerRunModalHide}/>
    </div>
  }

}

function mapStateToProps(state) {
  const { dockerImageList } = state.globalModel;
  return { dockerImageList };
}

export default connect(mapStateToProps)(ImageTable)
