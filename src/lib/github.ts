import { cache } from 'react';
import 'server-only';
import { socialLinks } from '@/app/data/socials';

// Extract GitHub username from the GitHub URL in socials
export function getGithubUsername(): string {
  const githubSocial = socialLinks.find(social => social.name === 'GitHub');
  if (!githubSocial) {
    return '';
  }
  
  // Extract username from the GitHub URL
  const username = githubSocial.url.split('github.com/')[1];
  return username || '';
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
  fork: boolean;
}

// Optional preload function to initiate data fetch early
export const preloadGithubRepos = () => {
  void getGithubRepos();
}

// Use React's built-in cache instead of manual implementation
export const getGithubRepos = cache(async (): Promise<GithubRepo[]> => {
  const username = getGithubUsername();
  if (!username) {
    return [];
  }
  
  try {
    // Fetch to get the first page and check response headers for pagination information
    let allRepos: GithubRepo[] = [];
    let page = 1;
    let hasMorePages = true;
    
    // GitHub API pagination - keep fetching until we get all repositories
    while (hasMorePages) {
      console.log(`Fetching GitHub repos page ${page}...`);
      
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          // Use Next.js fetch cache control
          next: { revalidate: 3600 } // Revalidate every hour
        }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const repos: GithubRepo[] = await response.json();
      
      // If we get fewer results than the per_page value, we've reached the last page
      if (repos.length === 0 || repos.length < 100) {
        hasMorePages = false;
      }
      
      allRepos = [...allRepos, ...repos];
      page++;
      
      // Safety check to prevent infinite loops
      if (page > 10) {
        hasMorePages = false;
        console.warn('Reached maximum page count (10) when fetching GitHub repositories');
      }
    }
    
    // Filter out forked repositories
    return allRepos.filter(repo => !repo.fork);
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    return [];
  }
});
