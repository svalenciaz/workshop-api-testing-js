const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

require('dotenv').config();

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
let githubUserName = '';
let repoName = '';
const issue = { title: 'Issue for testing' };
let issueNumber = null;
const newIssue = { body: 'Loret Ipsum' };

describe('Github Api Test', () => {
  describe('Issue', () => {
    it('POST to find logged user', async () => {
      const response = await agent.post(`${urlBase}/user`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.public_repos).to.greaterThan(0);
      githubUserName = response.body.login;
    });

    it(`GET public repository from ${githubUserName}`, async () => {
      const response = await agent
        .get(`${urlBase}/users/${githubUserName}/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');
      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body).containSubset([{ visibility: 'public' }]);
      repoName = response.body
        .find((element) => element.visibility === 'public').name;
    });

    it(`GET to confirm existence of ${repoName}`, async () => {
      const response = await agent
        .get(`${urlBase}/repos/${githubUserName}/${repoName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body.name).to.equal(repoName);
    });

    it(`POST create a new issue in ${repoName}`, async () => {
      const response = await agent
        .post(`${urlBase}/repos/${githubUserName}/${repoName}/issues`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(issue)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.CREATED);
      expect(response.body.title).to.equal(issue.title);
      expect(response.body.body).to.be.eql(null);
      issueNumber = response.body.number;
    });

    it(`PATCH the issue number ${issueNumber} from repo ${repoName}`, async () => {
      const response = await agent
        .patch(`${urlBase}/repos/${githubUserName}/${repoName}/issues/${issueNumber}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(newIssue)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body.title).to.equal(issue.title);
      expect(response.body.body).to.equal(newIssue.body);
    });
  });
});
