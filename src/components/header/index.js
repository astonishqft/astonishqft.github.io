import React from 'react';
import { Input, Col, Row, Avatar } from 'antd';
import styles from './index.less';

export default () => {
  return (
    <Row className={styles.root} type="flex" align="middle">
      <Col span={8} offset={4}>
        astonish blog
      </Col>
      <Col span={6}>
        <Input placeholder="请搜索" />
      </Col>
      <Col span={6} className={styles.avatar}>
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      </Col>
    </Row>
  )
}