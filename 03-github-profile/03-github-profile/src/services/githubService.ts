import type { GithubRepository } from '../interfaces/github-repository'
import type { GithubUser } from '../interfaces/github-user'

export async function getGithubUser(
  username: string,
): Promise<GithubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) return null
    return await response.json()
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

    if (!response.ok) return []
    const data = await response.json()

    repos = data
      .map((repo: any) => ({
        name: repo.name,
        visibility: repo.visibility,
        description: repo.description,
        forks_count: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count,
        html_url: repo.html_url,
      }))
      .sort(
        (a: GithubRepository, b: GithubRepository) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
    return repos
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}
