import React, { Component } from "react";
import { List, Icon, Tag } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import Markdown from '@/components/markdown';
import Archive from '@/components/archive'
import styles from './index.less';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

@connect(({ user, home }) => {
  return { user, home };
})
class Index extends Component {
  componentDidMount() {
    // 判断是否是登录授权成功之后重定向的地址
    const { dispatch } = this.props;
    const githubAuthCode = window.location.search.split('code=')[1]
    if (githubAuthCode) {
      dispatch({
        type: 'user/githubAuth',
        payload: {
          githubAuthCode
        }
      }).then(result => {
        if(result) {
          localStorage.setItem('github_token', result);
          window.location.href = window.location.href.split(/[?#]/)[0];
        }
      })
    }

    dispatch({
      type: 'home/getIssuesList',
    });
  }

  getTimeLine = issuesList => {
    const issues = issuesList.map(item => {
      return  {
        ...item,
        time: moment(item.created_at).format('Y-M')
      }
    });

    const result = issues.reduce((accumulator, current) => {
      if (current.time in accumulator) {
        accumulator[current.time].total++;
        accumulator[current.time].item.push(current);
        accumulator[current.time].number = current.number;
      }
      else {
        accumulator[current.time] = {
          total: 1,
          item: [current],
          number: current.number,
        };
      }
      return accumulator;
    }, {});
    return result;
  }

  getTags = issuesList => {
    let issues = [];
    issuesList.forEach(element => {
      issues = [...issues, ...element.labels]
    });

    issues.map(item => {
      return {
        ...item,
        id: `${item.id}`,
      }
    });

    const result = issues.reduce((accumulator, current) => {
      if (current.id in accumulator) {
        accumulator[current.id].total++;
        accumulator[current.id].color = current.color;
        accumulator[current.id].name = current.name;
      }
      else {
        accumulator[current.id] = {
          total: 1,
          color: current.color,
          name: current.name,
        };
      }
      return accumulator;
    }, {});

    return result;
  }

  handleTagChange = (tag) => {
    // TODO
  }

  render() {
    const { 
      home: {
        issuesList = []
      },
    } = this.props;

    const timeLine = this.getTimeLine(issuesList);
    const tags = this.getTags(issuesList);

    return (
      <div className={styles.root}>
        <Archive timeLine={timeLine} tags={tags} handleTagChange={this.handleTagChange} />
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
              className={styles.listItem}
              key={item.title}
              actions={[
                <Link to={`/${item.number}?scroll=like`}><IconText type="like-o" text={item.reactions['+1']} /></Link>
                ,
                <Link to={`/${item.number}?scroll=comment`}><IconText type="message" text={item.comments} /></Link>
                ,
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
              <div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ marginRight: 10 }}>{moment(item.created_at).format('Y-M-D')}</span>
                  {item.labels && item.labels.map(label => {
                    return (
                      <Tag
                        key={label.id}
                        style={{ background: `#${label.color}`, color: '#fff' }}
                      >{label.name}</Tag>)
                    }
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      }
      </div>
    )
  }
}

export default Index;
