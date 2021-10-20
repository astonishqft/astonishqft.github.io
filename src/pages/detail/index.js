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
  Skeleton,
  message,
} from 'antd';
import moment from 'moment';
import Catelog from '@/components/catelog';
import Markdown from '@/components/markdown';
import styles from './index.less'

const { TextArea } = Input;

@connect(({ home, user, loading }) => {
  return {
    home,
    user,
    submitting: loading.effects['home/createComment'],
    detailLoading: loading.effects['home/getIssueDetail'],
    commentLoading: loading.effects['home/getCommentList']
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
    headings: [],
    action: null,
  }

  article = null;

  componentDidMount() {
    const {
      match: {
        params: { id }
      },
      user: {
        userInfo: {
          isLogin
        }
      },
      dispatch,
      location: {
        query = {}
      }
    } = this.props;

    this.id = id;

    dispatch({
      type: 'home/getIssueDetail',
      payload: { id }
    }).then(() => {
      if (query) {
        let container = null;
        if (!isLogin) {
          container = document.getElementById('loginContainer')
        } else if (query.scroll === 'like') {
          container = document.getElementById('likesContainer')
        }
        if (container) {
          container.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }

        this.getHeadings();

      }
    })

    dispatch({
      type: 'home/getCommentList',
      payload: { id }
    }).then(() => {
      if (query) {
        let container = null;
        if (!isLogin) {
          container = document.getElementById('loginContainer')
        } else if (query.scroll === 'comment') {
          container = document.getElementById('commentContainer')
        }
        if (container) {
          container.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
      }
    });

    dispatch({
      type: 'home/listReactionForAnIssue',
      payload: { id }
    });
  }

  getHeadings = () => {
    // 获取heading，生成右侧锚点
    const headingEle = this.article.querySelectorAll('.heading');
    if (headingEle && Array.from(headingEle).length !==0 ) {
      const headings = Array.from(headingEle).map(heading => ({
        title: heading.innerText,
        id: heading.id,
        level: Number(heading.dataset.level),
        offsetTop: heading.offsetTop
      }));
      this.setState({
        headings,
      });
    }
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
      if (data) {
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
    const { dispatch, user: { userInfo = {} }, } = this.props;
    const { isLogin } = userInfo;
    if (!isLogin) {
      message.info('请先使用github账号登录！')
      return;
    }

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
    const {
      user: {
        userInfo: {
          isLogin
        }
      },
    } = this.props;
    if (!isLogin) {
      message.info('请先使用github账号登录！')
      return;
    }
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

  createReactionForIssue = () => {
    const { dispatch, user: { userInfo = {} } } = this.props;
    const { isLogin } = userInfo;
    if (!isLogin) {
      message.info('请先使用github账号登录！')
      return;
    }
    dispatch({
      type: 'home/createReactionForIssue',
      payload: {
        id: this.id,
      }
    });
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

  renderEditor = (onChange, onSubmit, submitting, value) => (
    <div>
      <Form.Item>
        <TextArea
          ref={text => this.commentText = text}
          rows={4}
          onChange={onChange}
          value={value}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary" id="commentContainer">
          添加评论
      </Button>
      </Form.Item>
    </div>
  );

  render() {
    const {
      comment,
      headings = [],
    } = this.state;

    const {
      home: {
        commentList = [],
        issueDetail: { body = '' },
        likes = [],
      },
      user: { userInfo = {} },
      submitting = false,
      detailLoading = false,
      commentLoading = false,
    } = this.props;

    const isLogin = userInfo.isLogin ? true : false;

    return (
      <div className={styles.detail} ref={ref => this.article = ref}>
        <Skeleton loading={detailLoading} active>
          <Markdown dataSource={body} />
          <div className={styles.append} id="likesContainer">
            <Icon type="like" theme="twoTone" twoToneColor="#eb2f96" onClick={this.createReactionForIssue} />
            <span className={styles.number}>{likes.length}</span>
          </div>
          <Catelog data={headings} />
        </Skeleton>

        <Skeleton loading={commentLoading} active avatar>
          <List
            className="comment-list"
            header={(
              <div className={styles['comment-header']}>
                <span>共 <b>{commentList.length}</b> 条回复</span>
                {
                  !isLogin ? (
                    <div className={styles.loginWrap} id="loginContainer">
                      <Button
                        type="primary"
                        onClick={() => {
                          window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.8fd715c6f01d9c3b&redirect_uri=https://qifutao.com';
                        }}>
                        github登录
                      </Button>
                    </div>) : null
                }
              </div>
              )}
            itemLayout="horizontal"
            dataSource={commentList}
            renderItem={item => (
              <li>
                <Comment
                  actions={this.formatAction(item)}
                  author={item.author_association}
                  avatar={item.user.avatar_url || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                  content={< Markdown dataSource={item.body} />}
                  datetime={this.formatTime(item.updated_at)}
                />
              </li>
            )}
          />
          {
            isLogin ? (
              <Comment
                avatar={
                  <Avatar
                    src={userInfo.avatar_url ? userInfo.avatar_url : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                    alt="Use photo"
                  />
                }
                content={
                  this.renderEditor(this.handleChange, this.handleSubmit, submitting, comment)
                }
              />
            ) : null
          }
        </Skeleton>
        <div className={styles.footer}>
          <b>&copy;2019-2021 astonishqft. All rights reserved.</b>
        </div>
      </div>
    )
  }
}

export default Detail;
