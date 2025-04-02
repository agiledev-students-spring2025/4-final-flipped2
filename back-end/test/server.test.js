import { use, expect } from 'chai'
import chaiHttp from 'chai-http'
const chai = use(chaiHttp)
import app from '../server.js';

chai.use(chaiHttp);


describe('Auth Routes', () => {
  it('POST /api/signup should register a new user', (done) => {
    chai.request(app)
      .post('/api/signup')
      .send({ email: 'test@example.com', password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        done();
      });
  });

  it('POST /api/login should allow valid login', (done) => {
    chai.request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        done();
      });
  });

  it('POST /api/login should reject invalid login', (done) => {
    chai.request(app)
      .post('/api/login')
      .send({ email: 'wrong@example.com', password: 'wrong' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal('fail');
        done();
      });
  });
});

