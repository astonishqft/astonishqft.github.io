import React from 'react';
import { Input, Col, Row, Avatar } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ user }) => {
  return { user };
})
class Header extends React.Component {
  render() {
    const { user: {userInfo = {}} } = this.props;
    return (
      <Row className={styles.root} type="flex" align="middle">
        <Col span={8} offset={4}>
          astonish blog
      </Col>
        <Col span={6}>
          <Input placeholder="请搜索" />
        </Col>
        <Col span={6} className={styles.avatar}>
          <Avatar src={userInfo.avatar_url ? userInfo.avatar_url :"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />
        </Col>
      </Row>
    )
  }
}

export default Header;
