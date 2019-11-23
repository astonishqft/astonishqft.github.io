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
// import 'github-markdown-css/github-markdown.css';
import styles from './index.less'

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        添加评论
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
    this.commentText = null;
  }
  state = {
    content: '',
    comment: '',
    detail: '',
    commentList: [],
    action: null,
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
    const { comment } = this.state;
    if (!comment) {
      return;
    }
    dispatch({
      type: 'home/createComment',
      payload: {
        id: this.id,
        value: comment,
      }
    }).then(data => {
      if(data) {
        this.setState({
          comment: '',
        });
      }
    });
  };

  handleChange = e => {
    this.setState({
      comment: e.target.value
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
    this.setState({
      action: 'liked',
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

  handleReply = item => {
    const { comment } = this.state
    const replyCommentBody = item.body
    let replyCommentArray = replyCommentBody.split('\n')
    replyCommentArray.unshift(`@${item.user.login}`)
    replyCommentArray = replyCommentArray.map(t => `> ${t}`)
    replyCommentArray.push('')
    replyCommentArray.push('')
    if (comment) replyCommentArray.unshift('')
    this.setState({ comment: replyCommentArray.join('\n') }, () => {
      this.commentText.focus();
    })
  }

  // 格式化actions 
  // 表情 type: +1, -1, laugh, confused, heart, hooray, rocket, eyes
  formatAction = item => {
    const { reactions = {} } = item;
    return [
      <span key="comment-basic-like">
        <Tooltip title="+1">
          <Icon
            type="like"
            onClick={() => this.handleReaction(item, '+1')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['+1']}</span>
      </span>,
      <span key=' key="comment-basic-dislike"'>
        <Tooltip title="-1">
          <Icon
            type="dislike"
            onClick={() => this.handleReaction(item, '-1')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['-1']}</span>
      </span>,
      <span key=' key="comment-basic-heart"'>
        <Tooltip title="Heart">
          <Icon
            type="heart"
            onClick={() => this.handleReaction(item, 'heart')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['heart']}</span>
      </span>,
      <span key=' key="comment-basic-rocket"'>
        <Tooltip title="Rocket">
          <Icon
            type="rocket"
            onClick={() => this.handleReaction(item, 'rocket')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['rocket']}</span>
      </span>,
      <span key=' key="comment-basic-laugh"'>
        <Tooltip title="Laugh">
          <Icon
            type="smile"
            onClick={() => this.handleReaction(item, 'laugh')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['laugh']}</span>
      </span>,
      <span key=' key="comment-basic-confused"'>
        <Tooltip title="Confused">
          <Icon
            type="frown"
            onClick={() => this.handleReaction(item, 'confused')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['confused']}</span>
      </span>,
      <span key=' key="comment-basic-eyes"'>
        <Tooltip title="Eyes">
          <Icon
            type="eye"
            onClick={() => this.handleReaction(item, 'eyes')}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{reactions['eyes']}</span>
      </span>,
      <span key="comment-basic-reply-to" onClick={() => this.handleReply(item)}>回复</span>,
    ];
  }

  render() {
    const {
      comment,
    } = this.state;
    const {
      home: {
        commentList = [],
        issueDetail: { body = '' },
      },
      user: { userInfo = {} }
    } = this.props;

    const isLogin = userInfo.isLogin ? true : false;

    return (
      <div className={styles.detail}>
        <Markdown dataSource={body} />
        <List
          className="comment-list"
          header={`共${commentList.length}条回复`}
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
        {
          isLogin ?  (
            <Comment
              avatar={
                <Avatar
                  src={userInfo.avatar_url ? userInfo.avatar_url : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                  alt="Use photo"
                />
              }
              content={
                <TextArea
                  ref={t => { this.commentText = t }}
                  value={comment}
                  rows={4}
                  onChange={this.handleChange}
                  onFocus={this.handleCommentFocus}
                  onBlur={this.handleCommentBlur}
                  onKeyDown={this.handleCommentKeyDown}
                />
                // <Editor
                //   ref = {textarea => this.commentText = textarea}
                //   onChange={this.handleChange}
                //   onSubmit={this.handleSubmit}
                //   submitting={this.submitting}
                //   value={comment}
                // />
              }
            />
          ) : null
        }

        {
          !isLogin ? (
            <div className={styles.loginWrap}>
              <Button
                type="primary"
                onClick={() => {
                  window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.8fd715c6f01d9c3b&redirect_uri=http://localhost:8000';
                }}>
                github登录
              </Button>
            </div>
          ) : null
        }
      </div>
    )
  }
}

export default Detail;
