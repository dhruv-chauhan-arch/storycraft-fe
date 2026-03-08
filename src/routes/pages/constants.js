export const API_URL = `${import.meta.env.VITE_API_URL}`;

export const HOME = "/";
export const PROJECTS = "/projects";
export const LIST_PROJECTS = "/list-projects";
export const PROJECT_DETAILS = "/project-details/:projectId";
export const STORIES = "/stories";
export const SYNC_JIRA = "/sync-jira";

// APIs
export const API_PROJECT = `${API_URL}/project`;
export const API_STORY = `${API_URL}/story`;
export const API_JIRA = `${API_URL}/jira`;
export const JIRA_LOGIN_LINK =
  "https://www.atlassian.com/try/cloud/signup?bundle=jira-software&edition=free&signupSource=skipBundles";