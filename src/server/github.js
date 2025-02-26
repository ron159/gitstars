import { httpRequestGithub } from './http-request';
import { useUserStore } from '@/store/user';

export async function getUserInfo() {
  return httpRequestGithub.get('/user');
}

export async function getLastCommitTimestamp(repository) {
  try {
    console.log('Repository object:', repository);
    const { owner, name } = repository;
    if (!owner || !owner.login || !name) {
      console.error('Invalid repository object:', repository);
      return null;
    }
    
    // 调试信息
    console.log('Owner:', owner);
    console.log('Owner login:', owner.login);
    console.log('Repository name:', name);
    
    // 检查token是否存在
    const userStore = useUserStore();
    if (!userStore.token) {
      console.error('No GitHub token found');
      return null;
    }
    
    // 首先检查仓库是否存在
    const repoUrl = `/repos/${owner.login}/${name}`;
    try {
      await httpRequestGithub.get(repoUrl);
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('Repository not found:', repoUrl);
        return null;
      }
      throw error;
    }
    
    // 获取默认分支
    const repoInfo = await httpRequestGithub.get(`/repos/${owner.login}/${name}`);
    const defaultBranch = repoInfo.data.default_branch || 'main';
    
    const commitsUrl = `/repos/${owner.login}/${name}/commits`;
    console.log('Fetching commits from:', commitsUrl, 'on branch:', defaultBranch);
    const res = await httpRequestGithub.get(commitsUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        sha: defaultBranch,
        per_page: 1,
        page: 1
      }
    });
    
    if (res.data && res.data.length > 0) {
      const commitDate = res.data[0].commit.author.date;
      console.log('Last commit timestamp:', commitDate);
      return commitDate;
    }
    
    // 尝试使用master分支
    const masterRes = await httpRequestGithub.get(`/repos/${owner.login}/${name}/commits`, {
      params: {
        sha: 'master',
        per_page: 1
      }
    });
    
    if (masterRes.data && masterRes.data.length > 0) {
      const commitDate = masterRes.data[0].commit.author.date;
      console.log('Last commit timestamp (master branch):', commitDate);
      return commitDate;
    }
    
    console.log('No commits found for the repository.');
    return null;
    
  } catch (error) {
    if (error.response) {
      console.error('GitHub API error:', error.response.status, error.response.data.message);
    } else {
      console.error('Error fetching last commit timestamp:', error.message);
    }
    return null;
  }
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
