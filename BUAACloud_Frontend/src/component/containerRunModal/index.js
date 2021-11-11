import React from 'react';
import { connect } from 'umi';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { CloudUploadOutlined, FileAddOutlined } from '@ant-design/icons';
import style from './index.less';
import moment from 'moment';

class ContainerRun extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnLoading: false
    }
  }
  formRef = React.createRef()

  // handle
  onOk = async () => {
    await this.setState({ uploadBtnLoading: true });
    await this.setState({ uploadBtnLoading: false });
    await this.props.hide()
  };

  onCancel = async () => {
    console.log('cancel');
    this.props.hide()
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.visible === true) {
      console.log('打开了对话框');
      console.log(nextProps)
    }
  }


  render() {
    return (
      <Modal
        title={`从镜像运行容器`}
        centered={true}
        visible={this.props.visible}
        okText={`确定`}
        onOk={this.onOk}
        okButtonProps={{loading: this.state.uploadBtnLoading}}
        cancelText={`取消`}
        onCancel={this.onCancel}
      >
        <Form
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
          ref={this.formRef}
          name="control-ref"
          // initialValues={{
          //   a: 1
          // }}
        >
          <Form.Item
            label="镜像名称"
            name="image_name"
            rules={[{ required: true, message: '请选择要使用的镜像名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="镜像标签"
            name="image_id"
            rules={[{ required: true, message: '请选择要使用的镜像标签' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  const { dockerImageList } = state.globalModel;
  return { dockerImageList };
}

export default connect(mapStateToProps)(ContainerRun)
