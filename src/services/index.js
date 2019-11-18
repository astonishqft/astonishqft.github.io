import axios from 'axios';
import { generateUUID } from '@/utils/utils';

const githubApi = 'https://api.github.com/repos/astonishqft/astonishqft.github.io';

const getIssuesList = () => {
  return axios({
    method: 'GET',
    url: `${githubApi}/issues`,
    headers: { 'Accept': 'application/vnd.github.squirrel-girl-preview' },
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
      'Accept': 'application/vnd.github.squirrel-girl-preview' },
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

const githubAuth = (code) => {
  // clientID = CLIENT_ID, clientSecret = CLIENT_SECRET, code
  const clientID = 'Iv1.8fd715c6f01d9c3b';
  const clientSecret = '092bfa8ea626471ce1de470b780cf865456be73b';
  // const code = '68eaa8d392aebe765052'
  return axios({
    method: 'POST',
    url: `https://now-blog-server.1551601581.now.sh/api/githubAuth?code=${code}&clientID=${clientID}&clientSecret=${clientSecret}&=88877766`,
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
};
