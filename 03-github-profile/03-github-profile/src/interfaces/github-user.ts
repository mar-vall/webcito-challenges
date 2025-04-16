export interface GithubUser {
    login: string;
    name: string | null;
    followers: number;
    following: number;
    bio: string | null;
    public_gists: number;
    twitter_username: string | null;
    avatar_url: string;
    location: string | null;
    blog: string | null;
  }