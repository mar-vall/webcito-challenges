import type { GithubRepository } from '../interfaces/github-repository'
import type { GithubUser } from '../interfaces/github-user'

export async function getGithubUser(
  username: string,
): Promise<GithubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (response.status === 404) return null
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)

    const data = await response.json()
    return {
      login: data.login,
      name: data.name,
      followers: data.followers,
      following: data.following,
      bio: data.bio,
      public_gists: data.public_gists,
      twitter_username: data.twitter_username,
      avatar_url: data.avatar_url,
      location: data.location,
      blog: data.blog,
    }
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    return null
  }
}

export async function getGithubRepos(
  username: string,
  page = 1,
  perPage = 6,
): Promise<GithubRepository[]> {
  let repos: GithubRepository[] = []

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?`,
      //   new URLSearchParams({
      //     page: page.toString(),
      //     per_page: perPage.toString(),
      //     sort: 'updated',
      //     direction: 'desc'
      //   })
    )

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    return data
      .map(
        (repo: any): GithubRepository => ({
          name: repo.name,
          visibility: repo.visibility || (repo.private ? 'private' : 'public'),
          description: repo.description,
          forks_count: repo.forks_count,
          language: repo.language,
          topics: repo.topics || [],
          updated_at: repo.updated_at,
          stargazers_count: repo.stargazers_count,
          html_url: repo.html_url,
        }),
      )
      .sort(
        (a: GithubRepository, b: GithubRepository) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}
