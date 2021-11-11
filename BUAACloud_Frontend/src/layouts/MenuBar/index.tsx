import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import React from 'react';

class MenuBar extends React.Component<any, any> {
  state = {
    current: 'index',
  }

  handleClick = (e: any) => {
    console.log('click', e)
    this.setState({ current: e.key });
    if (history.location.pathname !== e.key) history.push(e.key);
  };

  render() {
    const renderMenuBar = () => {
      return (
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key='index'>
            首页
          </Menu.Item>
          <Menu.Item key='page2'>
            页面2
          </Menu.Item>
          <Menu.Item key='page3'>
            页面3
          </Menu.Item>
        </Menu>
      )
    }

    return (
      <div>
        { renderMenuBar() }
        { this.props.children }
      </div>
    )
  }

}

export default MenuBar
