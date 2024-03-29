import axios from 'axios';
import { generateUUID } from '@/utils/utils';

const githubApi = 'https://api.github.com/repos/astonishqft/astonishqft.github.io';

const getIssuesList = () => {
  return axios({
    method: 'GET',
    url: `${githubApi}/issues`,
    headers: {
      'Accept': 'application/vnd.github.squirrel-girl-preview',
    },
  });
}

const getIssueDetail = id => {
  return axios({
    method: 'GET',
    url: `${githubApi}/issues/${id}`,
  });
}

const getUser = token => {
  return axios({
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: {
      accept: 'application/json',
      Authorization: `token ${token}`
    }
  });
}

const getReactionList = (comment_id) => {
  return axios({
    method: 'GET',
    url: `${githubApi}/issues/comments/${comment_id}/reactions`,
  });
}

// Create reaction for an issue
const createReactionForAnIssue = issue_number => {
  let headers = {}
  const token = localStorage.getItem('github_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return axios({
    method: 'post',
    headers: { 'Accept': 'application/vnd.github.squirrel-girl-preview', ...headers },
    url: `${githubApi}/issues/${issue_number}/reactions`,
    data: {
      content: '+1',
    }
  });
}

// List reactions for an issue
const listReactionForAnIssue = issue_number => {
  let headers = {}
  const token = localStorage.getItem('github_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return axios({
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.github.squirrel-girl-preview',
      ...headers,
    },
    url: `${githubApi}/issues/${issue_number}/reactions`,
  });
}

// Create reaction for an issue comment
const createReaction = (comment_id, type) => {
  let headers = {}
  const token = localStorage.getItem('github_token');
  if(token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return axios({
    method: 'post',
    headers: { 'Accept': 'application/vnd.github.squirrel-girl-preview', ...headers },
    url: `${githubApi}/issues/comments/${comment_id}/reactions`,
    data: {
      content: type,
    }
  });
}

// List comments on an issue
const getCommentByIssueId = issue_number => {
  return axios({
    method: 'GET',
    headers: {
      // 'Cache-Control': 'no-cache',
      'Accept': 'application/vnd.github.squirrel-girl-preview',
    },
    url: `${githubApi}/issues/${issue_number}/comments?${generateUUID()}`,
  });
}

// Create a comment
const createComment = (issue_number, body) => {
  let headers = {}
  const token = localStorage.getItem('github_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return axios({
    method: 'post',
    headers: { ...headers },
    url: `${githubApi}/issues/${ issue_number}/comments`,
    data: {
      body,
    },
  });
}

// 为了解决github的认证接口无法跨域的问题，需要改为在vercel上部署一个sreverless服务
const githubAuth = code => {
  return axios({
    method: 'POST',
    url: `https://now-blog-server-indol-two.vercel.app/api/githubAuth?code=${code}`,
  });
}

export {
  getIssuesList,
  getIssueDetail,
  createReaction,
  getReactionList,
  getCommentByIssueId,
  createComment,
  githubAuth,
  getUser,
  createReactionForAnIssue,
  listReactionForAnIssue,
}
