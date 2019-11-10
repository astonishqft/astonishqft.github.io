import React, { useState, useEffect } from "react";
import { List, Icon } from 'antd';
import Link from 'umi/link';
import { getIssuesList, githubAuth } from '@/services';
import Markdown from '@/components/markdown';

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export default props => {
  const [issuesList, setIssuesList]  = useState([]);

  useEffect(() => {
    // 判断是否是登录授权成功之后重定向的地址
    const githubAuthCode = window.location.search.split('code=')[1]
    if (githubAuthCode) {
      // const { data } = githubAuth(githubAuthCode)
      // if (data.error) {
      //   console.log('error')
      // } else {
      //   localStorage.setItem('github_token', `Bearer ${data.access_token}`)
      //   window.location.href = window.location.href.split(/[?#]/)[0]
      // }
    } else {
      getIssuesList().then(data => {
        setIssuesList(data.data);
      });
    }
  } , []);

  console.log(issuesList, 'issuesList')

  return (
    <div>{
      issuesList.length !== 0 && <List
        itemLayout="vertical"
        dataSource={issuesList}
        footer={
          <div>
            <b>ant design</b> footer part
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
