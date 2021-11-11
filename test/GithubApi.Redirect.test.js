const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

require('dotenv').config();

chai.use(chaiSubset);
const { expect } = chai;

const originalURL = 'https://github.com/aperdomob/redirect-test';
const redirectionURL = 'https://github.com/aperdomob/new-redirect-test';

describe('Github Api Test', () => {
  describe('Redirect', () => {
    it('HEAD to consult a redirect', async () => {
      let response;
      try {
        response = await agent
          .head(originalURL)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'svalenciaz')
          .set('Accept', 'application/vnd.github.v3+json');
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(statusCode.StatusCodes.MOVED_PERMANENTLY);
      expect(response.response.headers.location).to.equal(redirectionURL);
    });
    it('GET to consult a redirect', async () => {
      let response;
      try {
        response = await agent
          .get(originalURL)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'svalenciaz')
          .set('Accept', 'application/vnd.github.v3+json');
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.redirects).to.be.an('array').that.includes(redirectionURL);
    });
  });
});
