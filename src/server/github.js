import { httpRequestGithub } from './http-request';

export async function getUserInfo() {
  return httpRequestGithub.get('/user');
}

export async function getLastCommitTimestamp(params) {
  const { owner, name } = params;
  const res = await httpRequestGithub.get(`/repos/${owner}/${name}/commits`);
  if (res.data && res.data.length > 0) {
    return res.data[0].commit.author.date;
  }
  return null;
}

export async function getStarredRepositories(params) {
  return httpRequestGithub.get('/user/starred', { params });
}

export async function getRepositoryReadme(params) {
  return httpRequestGithub.get(`/repos/${params.owner}/${params.name}/readme`);
}

export async function getReadmeByMarkdown(content) {
  return httpRequestGithub.post('/markdown', {
    text: content,
  });
}

export async function getGithubRankingLanguageList() {
  const res = await fetch(
    'https://raw.githubusercontent.com/cfour-hi/github-ranking/main/languages.json',
  );
  const list = await res.json();
  return list;
}

export async function getGithubRankingLanguageMap() {
  const res = await fetch(
    `https://raw.githubusercontent.com/cfour-hi/github-ranking/main/ranking.json`,
  );
  const map = await res.json();
  return map;
}
