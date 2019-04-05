import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('Test account related endpoints - POST, GET, PATH, DELETE', () => {
  let generatedToken = null;

  /**
   * Sign in user to generate user token before test
   */
  before('Sign in user to obtain auth token to be used in other account operations', (done) => {
    const userCredential = {
      email: 'timitejumola@gmail.com',
      password: 'password',
    };

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(userCredential)
      .end((err, res) => {
        res.should.have.status(200);
        if (!err) {
          generatedToken = res.body.data.token;
        }
        done();
      });
  });

  /**
   * Test the POST /accounts/ endpoint
   */
  describe('POST /accounts', () => {});

  it('it should create a bank account', (done) => {
    const details = {
      type: 'savings',
      openingBalance: '0',
    };

    chai
      .request(app)
      .post('/api/v1/accounts')
      .send(details)
      .set('x-access-token', generatedToken)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.data.should.have.property('accountNumber');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('type');
        res.body.data.should.have.property('openingBalance');
        done();
      });
  });

  it('it should throw error when there is a missing payload fields', (done) => {
    const details = {
      type: 'savings',
    };

    chai
      .request(app)
      .post('/api/v1/accounts')
      .send(details)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.data.should.have.property('error');
        done();
      });
  });
});
