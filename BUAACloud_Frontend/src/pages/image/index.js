import React from 'react';
import { connect } from 'umi';
import { PageHeader } from 'antd';
import ImageTable from './imageTable';
import style from './index.less';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  initData = async () => {
    await this.setState({ loading: true });
    await this.setState({ loading: false });
  }

  componentDidMount() {
    this.initData().then()
  }

  render() {

    const renderPageHeader = () => {
      return <div>
        <PageHeader title={'镜像'}
                    subTitle={'镜像管理界面'}
        />
      </div>
    }

    return <div>
      { renderPageHeader() }
      <div className={style.content_box}>
        <ImageTable />
      </div>
    </div>

  }

}

function mapStateToProps({ globalModel }) {
  const { dockerImageList } = globalModel;
  return { dockerImageList };
}

export default connect(mapStateToProps)(Index);
