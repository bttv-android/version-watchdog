import { Octokit } from '@octokit/rest';

export default new Octokit({
  auth: process.env.BOT_TOKEN,
});
