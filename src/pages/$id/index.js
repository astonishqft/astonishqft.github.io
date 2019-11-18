import React, { Component } from 'react';
import { connect } from 'dva';
import { 
  Comment,
  Tooltip,
  List,
  Avatar,
  Form,
  Input,
  Button,
  Icon,
} from 'antd';
import moment from 'moment';
import Markdown from '@/components/markdown';
import 'github-markdown-css/github-markdown.css'

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

@connect(({ home, user }) => {
  return { 
    home,
    user,
  };
})
class Detail extends Component {
  constructor(props) {
    super(props);
    this.id = '';
  }
  state = {
    content: '',
    value : '',
    detail: '',
    commentList: [],
    action: null,
    reactions: {
      '+1': false,
      '-1': false,
      'heart': false,
      'laugh': false,
      'confused': false,
      'hooray': false,
      'rocket': false,
      'eyes': false,
    }
  }

  componentDidMount() {
    const { match: {
      params: {
        id,
      }
    }, dispatch } = this.props;

    this.id = id;

    dispatch({
      type: 'home/getIssueDetail',
      payload: { id }
    })

    dispatch({
      type: 'home/getCommentList',
      payload: { id }
    });
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { value } = this.state;
    if (!value) {
      return;
    }

    dispatch({
      type: 'home/createComment',
      payload: {
        id: this.id,
        value,
      }
    });
  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  // 格式化时间
  formatTime = time => {
    return (
      <span>
        发表于<span>{moment(time).fromNow()}</span>
      </span>
    )
  }

  // 表情 type: +1, -1, laugh, confused, heart, hooray, rocket, eyes
  handleReaction = (item, type) => {
    const { dispatch } = this.props;
    const { reactions } = this.state;
    this.setState({
      action: 'liked',
      reactions: { 
        ...reactions,
        ...{
          [type]: true,
        }
      }
    });
    dispatch({
      type: 'home/createReaction',
      payload: {
        commentId: item.id,
        issueId: this.id,
        type,
      }
    })
  };

  // 格式化actions 
  // 表情 type: +1, -1, laugh, confused, heart, hooray, rocket, eyes
  formatAction = item => {
    const { reactions = {} } = item;

    return [
      <span key="comment-basic-like">
        <Tooltip title="+1">
          <Icon
            type="like"
            theme={this.state.reactions['+1'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, '+1')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['+1']}</span>
      </span>,
      <span key=' key="comment-basic-dislike"'>
        <Tooltip title="-1">
          <Icon
            type="dislike"
            theme={this.state.reactions['-1'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, '-1')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['-1']}</span>
      </span>,
      <span key=' key="comment-basic-heart"'>
        <Tooltip title="Heart">
          <Icon
            type="heart"
            theme={this.state.reactions['heart'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, 'heart')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['heart']}</span>
      </span>,
      <span key=' key="comment-basic-rocket"'>
        <Tooltip title="Rocket">
          <Icon
            type="rocket"
            theme={this.state.reactions['rocket'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, 'rocket')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['rocket']}</span>
      </span>,
      <span key=' key="comment-basic-laugh"'>
        <Tooltip title="Laugh">
          <Icon
            type="smile"
            theme={this.state.reactions['laugh'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, 'laugh')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['laugh']}</span>
      </span>,
      <span key=' key="comment-basic-confused"'>
        <Tooltip title="Confused">
          <Icon
            type="frown"
            theme={this.state.reactions['confused'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, 'confused')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['confused']}</span>
      </span>,
      <span key=' key="comment-basic-eyes"'>
        <Tooltip title="Eyes">
          <Icon
            type="eye"
            theme={this.state.reactions['eyes'] ? 'filled' : 'outlined'}
            onClick={() => this.handleReaction(item, 'eyes')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['eyes']}</span>
      </span>,
      <span key="comment-basic-reply-to">回复</span>,
    ];
  }

  render() {
    const { 
      value,
   } = this.state;
    const { 
      home: {
        commentList = [],
        issueDetail: { body = ''},
      },
      user: { userInfo = {} }
    } = this.props;

    return (
      <div>
        <Markdown dataSource={body} />
        <List
          className="comment-list"
          header={`${commentList.length} replies`}
          itemLayout="horizontal"
          dataSource={commentList}
          renderItem={item => (
            <li>
              <Comment
                actions={this.formatAction(item)}
                author={item.author_association}
                avatar={item.user.avatar_url}
                content={< Markdown dataSource={item.body} />}
                datetime={this.formatTime(item.updated_at)}
              />
            </li>
          )}
        />

        <Comment
          avatar={
            <Avatar
              src={userInfo.avatar_url ? userInfo.avatar_url : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
              alt="Han Solo"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={this.submitting}
              value={value}
            />
          }
        />

        <Button
          onClick={() => {
            window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.8fd715c6f01d9c3b&redirect_uri=http://localhost:8000';
          }}>Login with github</Button>
      </div>
    )
  }
}

export default Detail;
