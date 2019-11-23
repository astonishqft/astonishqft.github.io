import React from 'react';
import { Input, Menu, Avatar, Dropdown, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ user }) => {
  return { user };
})
class Header extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const githubToken = localStorage.getItem('github_token');
    if (githubToken) {
      dispatch({ 
        type: 'user/getUser', 
        payload: { 
          token: localStorage.getItem('github_token'), 
        },
      });
    }
  }

  handleMenuClick = () => {
    const { dispatch } = this.props;
    localStorage.setItem('github_token', '');
    dispatch({
      type: 'user/clear',
    })
  }

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item key="logout"
          onClick={
            () => {
              this.handleMenuClick()
            }}>
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    )
  }

  handleSearch = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/search',
      payload: {
        keyword: value,
      },
    });
  }

  render() {
    const {
      user: {
       userInfo = {}
      }
    } = this.props;
    const avatarUrl = userInfo.avatar_url ? userInfo.avatar_url : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";
    return (
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.title}>astonish blog</div>
          <div className={styles.tool}>
            <Input.Search
              placeholder="请搜索"
              allowClear
              onSearch={value => this.handleSearch(value)}
              style={{width: '300px'}} />
            <Avatar
              className={styles.avatar}
              src={avatarUrl}
            />
            <Dropdown overlay={this.renderMenu()}>
              <Icon type="more" style={{ color: '#1DA57A', fontSize: 34 }} />
            </Dropdown>
          </div>

          
        </div>
      </div>
    )
  }
}

export default Header;
