import BlogHeader from '@/components/header';
import { ConfigProvider, Layout, Row, Col } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';


const { Header, Content } = Layout;

function BasicLayout(props) {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className={styles.root}>
        <Header>
          <BlogHeader />
        </Header>
        <Content>
          <Layout>
            {/* <Sider width={350}>
            我是侧边栏
          </Sider> */}
            <Row>
              <Col span={16} offset={4}>
                <Content>
                  {props.children}
                </Content>
              </Col>
            </Row>
          </Layout>
        </Content>
      </Layout>
    </ConfigProvider>

  );
}

export default BasicLayout;
