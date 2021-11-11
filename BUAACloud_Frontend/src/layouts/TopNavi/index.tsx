import React from 'react';
import styles from './index.less';
import { history } from 'umi';
import topNaviConfig from '../../config/topNaviConfig.js';

class Home extends React.Component {
  state = {
    loading: false,
    current: history.location.pathname
  }

  handleClick = (path: string) => {
    console.log('click', path)
    this.setState({ current: path });
    if (history.location.pathname !== path) history.push(path);
  };

  initData = async () => {
    await this.setState({ loading: true });
    // do something
    await this.setState({ loading: false });
  }

  componentDidMount() {
    this.initData().then();
  }

  render() {

    const renderMenuBar = () => {
      return <div>
        <div className={styles.outside_box}>
          {/*左侧标题*/}
          <div className={styles.title_left_box}>
            <span className={styles.title_left}>{topNaviConfig?.leftTitle}</span>
          </div>
          {/*中间按钮*/}
          <div className={styles.btn_center_box}>
            {
              topNaviConfig?.primaryTitle?.map((item: { path: string; title: string; }, index: number | string) =>
                <div className={this.state.current === item.path ? styles.btn_center_highlight : styles.btn_center} key={index} onClick={this.handleClick.bind(this, item.path)}>{item.title}</div>
              )
            }
          </div>
        </div>
      </div>
    }

    return <div>
      { renderMenuBar() }
      { this.props.children }
    </div>
  }
}

export default Home
