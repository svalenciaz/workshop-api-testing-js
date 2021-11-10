const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const expect = chai.expect;



describe('First Api Tests', () => {
    const query = {
        name: 'Santiago',
        age: '22',
        city: 'Porto Alegre'
    };

    it('Consume HEAD Service', async () => {
        const response = await agent.head('https://httpbin.org/ip');
        
        expect(response.status).to.equal(statusCode.OK);
    });

    it('Consume GET Service', async () => {
        const response = await agent.get('https://httpbin.org/ip');
        
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
    });

    it('Consume HEAD Service with query parameters', async () => {

        const response = await agent.head('https://httpbin.org/get').query(query);
      
        expect(response.status).to.equal(statusCode.OK);
    });

    it('Consume GET Service with query parameters', async () => {
      
        const response = await agent.get('https://httpbin.org/get').query(query);
      
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.args).to.eql(query);
    });

    it('Consume PATCH Service', async () => {
        const response = await agent.patch('https://httpbin.org/patch').send(query);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
        expect(response.body.json).to.eql(query);
    });

    it('Consume PUT Service', async () => {
        const response = await agent.put('https://httpbin.org/put').send(query);
        
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
        expect(response.body.json).to.eql(query);
    });

    it('Consume POST Service', async () => {
        const response = await agent.post('https://httpbin.org/post').send(query);
        
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
        expect(response.body.json).to.eql(query);
    });

    it('Consume DELETE Service', async () => {
        const response = await agent.delete('https://httpbin.org/delete').send(query);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
        expect(response.body.json).to.eql(query);
    });
});