import React from 'react';
import { connect } from 'umi';
import { PageHeader } from 'antd';
import style from './index.less';
import BuildTables from './buildTables';


class Build extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:  false
    }
  }

  // initData
  initData = async () => {
    await this.setState({ loading: true })
    await this.setState({ loading: false })
  }

  // life Cycle
  componentDidMount() {
    this.initData().then()
  }

  render() {

    const renderPageHeader = () => {
      return <div>
        <PageHeader title={'构建'}
                    subTitle={'构建管理界面'}
        />
      </div>
    }

    return <div>
      { renderPageHeader() }
      <div className={style.content_box}>
        <BuildTables />
      </div>
    </div>
  }

}

function mapToStateToProps({ globalModel }) {
  const { dockerImageList } = globalModel;
  return { dockerImageList }
}

export default connect(mapToStateToProps)(Build);
