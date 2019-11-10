import React, {useState, useEffect} from 'react';
import { getIssueDetail, createComment } from '@/services';
import { Comment, Tooltip, List, Avatar, Form, Input, Button } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import Markdown from '@/components/markdown';

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

export default (props) => {
  const [ detail, setDetail] = useState('');
  const [ value, setVale ] = useState('');
  const [comments, setComments] = useState([]);
  const [ issueNumber, setIssueNumber ] = useState('');

  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const { match: {
      params: {
        id,
      }
    } } = props;

    setIssueNumber(id);
    

    getIssueDetail(id).then(result => {
      const { status, data: { body} } = result;
      if(status === 200) {
      setDetail(body);

      }
      console.log(7777, body)
    })
  }, [props]);


  const data = [
    {
      actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content: (
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure), to help people create their product prototypes beautifully and
          efficiently.
      </p>
      ),
      datetime: (
        <Tooltip
          title={moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD HH:mm:ss')}
        >
          <span>
            {moment()
              .subtract(1, 'days')
              .fromNow()}
          </span>
        </Tooltip>
      ),
    },
    {
      actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content: (
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure), to help people create their product prototypes beautifully and
          efficiently.
      </p>
      ),
      datetime: (
        <Tooltip
          title={moment()
            .subtract(2, 'days')
            .format('YYYY-MM-DD HH:mm:ss')}
        >
          <span>
            {moment()
              .subtract(2, 'days')
              .fromNow()}
          </span>
        </Tooltip>
      ),
    },
  ];

  const handleSubmit = () => {
    if (!value) {
      return;
    }

    setSubmitting(true);

    createComment(issueNumber, value).then(result => {
      console.log(result, 66666)
    });

  };

  const handleChange = e => {
    setVale(e.target.value);
  };

  return (
    <div>
      <Markdown dataSource={detail} />
      <List
        className="comment-list"
        header={`${data.length} replies`}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />

      <Comment
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
      
      <Link to="https://github.com/login/oauth/authorize?client_id=Iv1.8fd715c6f01d9c3b&redirect_uri=https://localhost:8000">Github</Link>
      <Button
        onClick={() => {
          window.open('https://github.com/login/oauth/authorize?client_id=Iv1.8fd715c6f01d9c3b&redirect_uri=http://localhost:8000')
      }}>Login with github</Button>
    </div>
  )
}
