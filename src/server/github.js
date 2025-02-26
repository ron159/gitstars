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

    // 获取默认分支 (先尝试master, 后尝试其他分支)
    let defaultBranch = 'master';
    try {
      const repoInfo = await httpRequestGithub.get(repoUrl);
      if (repoInfo?.default_branch) {
        defaultBranch = repoInfo.default_branch;
      }
    } catch (error) {
      console.warn(
        'Failed to get default branch, using master as fallback:',
        error.message,
      );
    }

    // 尝试使用master分支
    const masterCommitsUrl = `/repos/${owner.login}/${name}/commits`;
    try {
      const masterRes = await httpRequestGithub.get(masterCommitsUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          sha: 'master',
          per_page: 1,
          page: 1,
        },
      });
      if (masterRes && masterRes.length > 0) {
        const commitDate = masterRes[0].commit.author.date;
        return commitDate;
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('master branch not exists in repository:', masterCommitsUrl);
      }
    }

    //尝试其他分支
    const commitsUrl = `/repos/${owner.login}/${name}/commits`;
    try {
      const res = await httpRequestGithub.get(commitsUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          sha: defaultBranch,
          per_page: 1,
          page: 1,
        },
      });
      if (res && res.length > 0) {
        const commitDate = res[0].commit.author.date;
        return commitDate;
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('default branch not exists in repository:', commitsUrl);
      }
    }
    return null;
  } catch (error) {
    if (error.response) {
      console.error(
        'GitHub API error:',
        error.response.status,
        error.response.data.message,
      );
    } else {
      console.error('Error fetching last commit timestamp:', error.message);
    }
    return null;
  }
}

export async function getStarredRepositories(params) {
  const userStore = useUserStore();
  if (!userStore.token) {
    console.error('No GitHub token found');
    return null;
  }

  let allRepos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await httpRequestGithub.get('/user/starred', {
      params: {
        per_page: 100,
        page: page,
        ...params,
      },
    });

    if (res && res.length > 0) {
      allRepos = allRepos.concat(res);
      page++;
    } else {
      hasMore = false;
    }
  }

  // Extract relevant data, including forks_count
  const formattedRepos = allRepos.map(item => ({
    id: item.repo.id,
    name: item.repo.name,
    full_name: item.repo.full_name,
    description: item.repo.description,
    html_url: item.repo.html_url,
    stargazers_count: item.repo.stargazers_count,
    forks_count: item.repo.forks_count,
    language: item.repo.language,
    owner: item.repo.owner,
  }));

  const promises = formattedRepos.map(async (repo) => {
    const timestamp = await getLastCommitTimestamp({ owner: repo.owner, name: repo.name });
    return {
      ...repo,
      lastCommitTimestamp: timestamp,
    };
  });

  const finalRepos = await Promise.all(promises);
  console.log('get star repositorys :', finalRepos);
  return finalRepos;
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
