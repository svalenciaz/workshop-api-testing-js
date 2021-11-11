const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

require('dotenv').config();

chai.use(chaiSubset);
const { expect } = chai;

const url = 'https://api.github.com/users';

describe('Github Api Test', () => {
  describe('Redirect', () => {
    it('GET to consult default users', async () => {
      const response = await agent
        .get(url)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body).to.be.an('array').that.has.lengthOf(30);
    });
    it('GET to consult 10 users', async () => {
      const response = await agent
        .get(url)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 10 })
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body).to.be.an('array').that.has.lengthOf(10);
    });
    it('GET to consult 50 users', async () => {
      const response = await agent
        .get(url)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 50 })
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body).to.be.an('array').that.has.lengthOf(50);
    });
  });
});
