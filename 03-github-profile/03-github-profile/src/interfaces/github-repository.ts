export interface GithubRepository {
  name: string
  visibility: string
  description: string | null
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  stargazers_count: number
  html_url: string
}
