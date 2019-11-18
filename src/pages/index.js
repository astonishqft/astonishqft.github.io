import React, { Component } from "react";
import { List, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { getIssuesList, githubAuth } from '@/services';
import Markdown from '@/components/markdown';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

@connect(({ user }) => {
  return { user };
})
class Index extends Component {
  state = {
    issuesList: [],
  }

  componentDidMount() {
    // 判断是否是登录授权成功之后重定向的地址
    const { dispatch } = this.props;
    const githubAuthCode = window.location.search.split('code=')[1]
    if (githubAuthCode) {
      githubAuth(githubAuthCode).then(result => {
        const { data:{ data= {} } } = result;
        if (data.error) {
          return;
        } else {
          if (data.access_token) {
            localStorage.setItem('github_token', data.access_token);
            // localStorage.setItem('auth_token', `token ${data.access_token}`);

            // 获取当前登录用户信息
            window.location.href = window.location.href.split(/[?#]/)[0];

           
          }
        }
      });
    } else {
      getIssuesList().then(data => {
        this.setState({
          issuesList: data.data,
        })
      });

      if(localStorage.getItem('github_token')) {
        dispatch({
          type: 'user/getUser',
          payload: {
            token: localStorage.getItem('github_token'),
          },
        });
      }

      
    }
  }

  render() {
    const { issuesList = [] } = this.state;
    return (
      <div>
      {
        Array.isArray(issuesList) && <List
          itemLayout="vertical"
          dataSource={issuesList}
          footer={
            <div>
              <b>astonishqft</b> blog
          </div>
          }
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={[
                // <IconText type="star-o" text="156" key="list-vertical-star-o" />,
                <IconText type="like-o" text={item.reactions['+1']} key="list-vertical-like-o" />,
                <IconText type="message" text={item.comments} key="list-vertical-message" />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src={item.body.match(/!\[.+?\]\((.+?[^)]*)\)/)[1]}
                />
              }
            >
              <List.Item.Meta
                title={
                  <Link to={`/${item.number}`}>{item.title}</Link>
                }
              />
              <Markdown dataSource={item.body.match(/<p>(.*?)<\/p>/)[0]} />
            </List.Item>
          )}
        />
      }
      </div>
    )
  }
}

export default Index;
