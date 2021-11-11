import React from 'react';
import { connect } from 'umi';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { CloudUploadOutlined, FileAddOutlined } from '@ant-design/icons';
import style from './uploadImageModal.less';
import moment from 'moment';

class UploadImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadBtnLoading: false,
      file: null,
      fileList: [],
    }
  }
  formRef = React.createRef()

  // handle
  uploadOnChange = async (data) => {
    console.log(data)
    await this.setState({
      file: data.file,
      fileList: data.fileList
    });
  };

  uploadFile = async () => {
    let formData = new FormData();
    this.state.fileList.forEach(item => {
      formData.append('tar', item.originFileObj)
    });
    await this.props.dispatch({ type: 'globalModel/uploadImageFile', payload: formData });
  }

  onOk = async () => {
    await this.setState({ uploadBtnLoading: true });
    await this.uploadFile()
    await this.setState({ uploadBtnLoading: false, file: null, fileList: [] });
    await this.props.hide()
  };

  onCancel = async () => {
    console.log('cancel');
    this.props.hide()
  }


  render() {
    return (
      <Modal
        title={`上传镜像`}
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
            label="选择镜像"
            name="username"
            rules={[{ required: true, message: '输入您的用户名' }]}
          >
            <Upload
              // name={`file`}
              accept={`.tar`}
              multiple={false}
              beforeUpload={() => false}
              fileList={this.state.fileList}
              onChange={this.uploadOnChange}
              openFileDialogOnClick={this.state.fileList.length === 0}
            >
              {
                <Button type={'dashed'} disabled={this.state.fileList.length > 0} icon={<FileAddOutlined />}>点击选择 *.tar 格式的文件</Button>
              }
            </Upload>
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

export default connect(mapStateToProps)(UploadImageModal)
