import BlogHeader from '@/components/header';
import { ConfigProvider, BackTop } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';

function BasicLayout(props) {
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.root}>
        <BackTop
          target={() => document.getElementById('page-container')}
        />
        <BlogHeader />
        <div className={styles.content} id="page-container">
          <div className={styles.body}>
            {props.children}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default BasicLayout;
