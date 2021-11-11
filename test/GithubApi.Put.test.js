const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

require('dotenv').config();

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Github Api Test', () => {
  describe('Repositories', () => {
    it(`PUT to follow ${githubUserName}`, async () => {
      const response = await agent
        .put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'request')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });

    it(`GET to verify if I am following an ${githubUserName}`, async () => {
      const response = await agent.get('https://api.github.com/user/following')
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'request')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.be.an('array');
      expect(response.body).containSubset([{ login: 'aperdomob' }]);
    });

    it(`PUT to try to follow ${githubUserName} again`, async () => {
      const response = await agent
        .put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'request')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
  });
});
