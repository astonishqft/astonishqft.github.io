import axios from 'axios';

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

const getReactionList = (comment_id) => {
  return axios({
    method: 'GET',
    url: `${githubApi}/issues/comments/${comment_id}/reactions`,
  });
}

// Create reaction for an issue comment
const createReaction = (comment_id,) => {
  return axios({
    method: 'POST',
    headers: { 'Accept': 'application/vnd.github.squirrel-girl-preview+json' },
    url: `${githubApi}/issues/comments/${comment_id}/reactions`
  });
}

// List comments on an issue
const getCommentByIssueId = issue_number => {
  return axios({
    method: 'GET',
    url: `${githubApi}/issues/${issue_number}/comments`,
  });
}

// Create a comment
const createComment = (issue_number, body) => {
  return axios({
    method: 'POST',
    headers: { 'Accept': 'application/vnd.github.squirrel-girl-preview+json' },
    url: `${githubApi}/issues/${ issue_number}/comments`,
    data: {
      body,
    },
  });
}

const githubAuth = () => {
  // return axios({
  //   method: 'POST',
  //   // headers: { 'Accept': 'application/vnd.github.squirrel-girl-preview+json' },
  //   // url: `${githubApi}/issues/${issue_number}/comments`,
  //   // data: {
  //   //   body,
  //   // },
  // });
}

export {
  getIssuesList,
  getIssueDetail,
  createReaction,
  getReactionList,
  getCommentByIssueId,
  createComment,
  githubAuth,
};
