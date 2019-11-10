import BlogHeader from '@/components/header';
import { Layout, Row, Col } from 'antd';
import styles from './index.less';


const { Header, Content } = Layout;

function BasicLayout(props) {
  return (
    // <div className={styles.normal}>
    //   {/* <h1 className={styles.title}>Yay! Welcome to umi!</h1> */}
    //   <Header />
    //   {props.children}
    // </div>
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
  );
}

export default BasicLayout;
