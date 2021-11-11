const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

require('dotenv').config();

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
let gistURL = '';
const gistInfo = {
  description: 'Test gist',
  files: {
    hello_world: {
      content: 'print("Hello world")\n'
    }
  },
  public: true
};

describe('Github Api Test', () => {
  describe('Gists', () => {
    it('POST to create a new gist', async () => {
      const response = await agent
        .post(`${urlBase}/gists`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(gistInfo)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.CREATED);
      expect(response.body.description).to.be.equal(gistInfo.description);
      expect(response.body.public).to.be.equal(gistInfo.public);
      expect(response.body.files).to.be.an('object');
      expect(response.body.files.hello_world.content).to.be.eql(gistInfo.files.hello_world.content);
      gistURL = response.body.url;
    });
    it('GET to consult the new gist', async () => {
      const response = await agent
        .get(gistURL)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.OK);
      expect(response.body).containSubset(gistInfo);
    });
    it('DELETE to delete the new gist', async () => {
      const response = await agent
        .delete(gistURL)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'svalenciaz')
        .set('Accept', 'application/vnd.github.v3+json');

      expect(response.status).to.equal(statusCode.StatusCodes.NO_CONTENT);
    });
    it('GET to consult the deleted gist', async () => {
      let response;
      try {
        response = await agent
          .get(gistURL)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'svalenciaz')
          .set('Accept', 'application/vnd.github.v3+json');
      } catch (error) {
        response = error;
      }

      expect(response.status).to.equal(statusCode.StatusCodes.NOT_FOUND);
    });
  });
});
