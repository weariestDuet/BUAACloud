import React from 'react';
import { connect } from 'umi';
import { Button, Input, Popconfirm, Table, Tooltip, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import style from './containerTable.less';

class ContainerTable extends React.Component {
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
        title: '容器ID',
        dataIndex: 'container_id',
        key: 'container_id',
        width: 300,
      },
      {
        title: '容器名称',
        dataIndex: 'container_name',
        key: 'container_name',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 120,
        
        // render: text => <span>{(Number(text) / 1000000).toFixed(2)}MB</span>
      },
      {
        title: '镜像name',
        dataIndex: 'image',
        key: 'image',
        width: 180,
        // ellipsis: { showTitle: false },
        // render: text => (
        //   <Tooltip placement='topLeft' title={text}>
        //     {text}
        //   </Tooltip>
        // )
      },
      {
        title: '状态',
        dataIndex: 'Status',
        key:  'Status',
        width: 120,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: record => <div>
          <Button type='link'>运行容器</Button>
          <Button type='link' onClick={this.onRestart.bind(this, record)}>重启容器</Button>
          <Popconfirm title={`确认停止运行容器「${record?.container_id}」吗？`}
                      onConfirm={this.onStop.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link' style={{color: 'red'}}>停止运行容器</Button>
          </Popconfirm>
          <Popconfirm title={`确认删除容器「${record?.container_id}」吗？`}
                      onConfirm={this.onRemove.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link' style={{color: 'red'}}>删除容器</Button>
          </Popconfirm>
        </div>
      }
    ];
    this.state = {
      dataLoading: false,
      tableWidth: 'max-content',
      uploadModalVisible: true
    };
  }

  // handle
  uploadModalVisible = () => {
    this.setState({ uploadModalVisible: true })
  
  }
  uploadModalHide = () => {
    this.setState({ uploadModalVisible: false })
  }

  onSave = async record => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({type: 'globalModel/saveImage', payload: { image_name: record.image_name, image_tag: record.image_tag, image_id: record.image_id } })
    await this.setState({ dataLoading: false });
  }

  onStop = async record => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({type: 'containerModel/stopContainer', payload: { container_id: record.container_id } })
    message.success(`已停止运行容器「${record.container_id}」`)
    await this.setState({ dataLoading: false });
  }

  onRemove = async record => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({type: 'containerModel/removeContainer', payload: { container_id: record.container_id } })
    message.success(`已删除容器「${record.container_id}」`)
    await this.setState({ dataLoading: false });
  }
  
  onRestart = async record => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({type: 'containerModel/restartContainer', payload: { container_id: record.container_id } })
    message.success(`已重启容器「${record.container_id}」`)
    await this.setState({ dataLoading: false });
  }

  initData = async () => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({ type: 'containerModel/getContainerList'});
    await this.setState({ dataLoading: false });
  };

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
                    dataSource={this.props.containerList}
                    loading={this.state.dataLoading}
                    bordered
                    sticky
      />
    }

    return <div>
      { renderActionBar() }
      { renderTable() }
    </div>
  }

}

function mapStateToProps(state) {
  const { containerList } = state.containerModel;
  if(containerList.length>0)
  //importent code!!!
    containerList.map((o,i)=>{
    containerList[i]["Status"] = containerList[i].state.Status
    containerList[i]["image"] = containerList[i].image_list[0].image_name
  })
  console.log(containerList)
  return { containerList };
}

export default connect(mapStateToProps)(ContainerTable)
