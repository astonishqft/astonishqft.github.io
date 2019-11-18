import BlogHeader from '@/components/header';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';

function BasicLayout(props) {
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.root}>
        <BlogHeader />
        <div className={styles.content}>
          <div className={styles.body}>
            {props.children}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default BasicLayout;
