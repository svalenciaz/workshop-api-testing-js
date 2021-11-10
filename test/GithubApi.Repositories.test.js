const agent = require('superagent');
const statusCode = require('http-status-codes');
const crypto = require('crypto');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const name = 'Alejandro Perdomo';
const company = 'Perficient Latam';
const location = 'Colombia';
const repoMD5 = 'df39e5cda0f48ae13a5c5fe432d2aefa';
const repoDescription = 'An awesome html report for Jasmine';
const repository = 'jasmine-awesome-report';
const infoRepo = {
  name: 'README.md',
  path: 'README.md',
  sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
};
const readMeMD5 = '97ee7616a991aa6535f24053957596b1';

function MD5(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

describe('Github Api Test', () => {
  describe('Repositories', () => {
    let reposURL = '';

    it('GET to find user', async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).to.equal(name);
      expect(response.body.company).to.equal(company);
      expect(response.body.location).to.equal(location);

      reposURL = response.body.repos_url;
    });

    it('GET to repositories list', async () => {
      const response = await agent.get(reposURL)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.be.an('array');
      const selectedRepo = response.body.find((element) => element.name === repository);
      expect(selectedRepo.full_name).to.equal(`${githubUserName}/${repository}`);
      expect(selectedRepo.private).to.equal(false);
      expect(selectedRepo.description).to.equal(repoDescription);
    });

    it('GET to download repository', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}/zipball/master`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(MD5(response.body)).to.equal(repoMD5);
    });

    let documentDownloadURL = '';

    it('GET to find the README.md on the repo', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}/contents`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.be.an('array');
      expect(response.body).containSubset([infoRepo]);
      documentDownloadURL = response.body.find((element) => element.name === 'README.md').download_url;
    });

    it('GET to download the README.md from the repo', async () => {
      const response = await agent.get(documentDownloadURL)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(MD5(response.text)).to.equal(readMeMD5);
    });
  });
});
