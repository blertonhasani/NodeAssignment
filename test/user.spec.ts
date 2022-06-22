/* eslint-disable no-unused-expressions */
import * as chai from 'chai';
import * as request from 'supertest';
import mongo from './MockMongo';
import User from '../src/models/user';
import app from '../src/app';
import httpStatusCode from '../src/responses/statusCodes.response';
import verifyToken from '../src/helpers/verifyToken';
import generateToken from '../src/helpers/generateToken';
import UserForToken from '../src/dto/userForToken';

const { expect } = chai;

describe('Testing App API', () => {
  before(async () => {
    await mongo.connect();
  });

  after(async () => {
    await mongo.disconnect();
  });

  let mockUser1;
  let mockUser2;

  beforeEach(async () => {
    const user1 = {
      username: 'user1',
      password: '12345678',
    };
    mockUser1 = new User({ username: user1.username, password: user1.password });

    const user2 = {
      username: 'user2',
      password: '12345678',
    };
    mockUser2 = new User({ username: user2.username, password: user2.password });

    await Promise.all([mockUser1.save(), mockUser2.save()]);
    mockUser1.password = user1.password;
    mockUser2.password = user2.password;
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('should signup a user', async () => {
    const mockUser = {
      username: 'user3',
      password: '12345678',
    };
    const response = await request(app).post('/signup').send(mockUser);
    expect(response.status).equals(httpStatusCode.CREATED);
  });

  it('should not register user if a user with same username exists', async () => {
    const mockUser = {
      username: mockUser1.username,
      password: mockUser1.password,
    };
    const response = await request(app).post('/signup').send(mockUser);
    expect(response.status).equals(httpStatusCode.CONFLICT);
  });

  it('should return a token on user login successfully', async () => {
    const mockUser = {
      username: mockUser1.username,
      password: mockUser1.password,
    };
    const response = await request(app).post('/login').send(mockUser);
    expect(response.body.result.token).to.be.not.null;
    const token = verifyToken(response.body.result.token);
    expect(token.id).equals(mockUser1._id.toString());
  });

  it('should not login if user is not signed up', async () => {
    const mockUser = {
      username: 'user3',
      password: '12345678',
    };
    const response = await request(app).post('/login').send(mockUser);
    expect(response.status).equals(httpStatusCode.NOT_FOUND);
  });

  it('should not log in if a user enters the wrong password', async () => {
    const incorrectPassword = 'test1234567';
    const mockUser = {
      username: mockUser1.username,
      password: incorrectPassword,
    };
    const response = await request(app).post('/login').send(mockUser);
    expect(response.status).equals(httpStatusCode.UNAUTHORIZED);
  });

  it('should get user information by token authentication', async () => {
    const mockUser = {
      username: mockUser1.username,
      password: mockUser1.password,
    };

    const userForToken = new UserForToken(mockUser1._id);
    const token = generateToken(userForToken);
    const getMeResponse = await request(app).get('/me').set('Authorization', `Bearer ${token}`);

    expect(getMeResponse.body.result.username).equals(mockUser.username);
    expect(getMeResponse.body.result.password).to.be.undefined;
    expect(getMeResponse.body.result.likes.length).equals(0);
  });

  it('should update user password', async () => {
    const newPassword = '132131232';
    const userForToken = new UserForToken(mockUser1._id);
    const token = generateToken(userForToken);
    const response = await request(app)
      .put('/me/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: mockUser1.password, newPassword, confirmPassword: newPassword });

    expect(response.status).equals(httpStatusCode.OK);
  });

  it('should return not update the user if user does not exist', async () => {
    const { _id: id } = mockUser1;
    await User.findOneAndDelete({ _id: id });
    const newPassword = '132131232';
    const userForToken = new UserForToken(`${id}`);
    const token = generateToken(userForToken);
    const response = await request(app)
      .put('/me/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'test121454', newPassword, confirmPassword: newPassword });

    expect(response.status).equals(httpStatusCode.NOT_FOUND);
  });

  it('should not update the user if current password is not correct', async () => {
    const { _id: id } = mockUser1;
    const newPassword = '652343211';
    const userForToken = new UserForToken(`${id}`);
    const token = generateToken(userForToken);
    const response = await request(app)
      .put('/me/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'test123221', newPassword, confirmPassword: newPassword });

    expect(response.status).equals(httpStatusCode.BAD_REQUEST);
  });

  it('should not update the user if new password and confirmation are not the same ', async () => {
    const { _id: id } = mockUser1;
    const newPassword = '654321211';
    const userForToken = new UserForToken(`${id}`);
    const token = generateToken(userForToken);
    const response = await request(app)
      .put('/me/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: mockUser1.password, newPassword, confirmPassword: 'test121212' });

    expect(response.status).equals(httpStatusCode.BAD_REQUEST);
  });

  it('should return a user selected by id', async () => {
    const { _id } = mockUser1;
    const response = await request(app).get(`/user/${_id}`);
    expect(response.status).equals(httpStatusCode.OK);
    expect(response.body.result.username).equals(mockUser1.username);
    expect(response.body.result.numberOfLikes).equals(0);
  });

  it('should return not found if user not exist', async () => {
    const { _id: id } = mockUser1;
    await User.findOneAndDelete({ _id: id });
    const response = await request(app).get(`/user/${id}`);
    expect(response.status).equals(httpStatusCode.NOT_FOUND);
  });

  it('should like a specified user', async () => {
    const { _id: userId } = mockUser1;
    const userForToken = new UserForToken(`${userId}`);
    const token = generateToken(userForToken);
    const { _id: id } = mockUser2;
    const response = await request(app).put(`/user/${id}/like`).set('Authorization', `Bearer ${token}`);
    expect(response.status).equals(httpStatusCode.OK);
  });

  it('should return bad request if user trying to like itself', async () => {
    const { _id: id } = mockUser1;
    const userForToken = new UserForToken(`${id}`);
    const token = generateToken(userForToken);
    const response = await request(app).put(`/user/${id}/like`).set('Authorization', `Bearer ${token}`);
    expect(response.status).equals(httpStatusCode.BAD_REQUEST);
  });

  it('should return bad request if the user already liked this user', async () => {
    const { _id: id } = mockUser2;
    const { _id: userId } = mockUser1;
    const userForToken = new UserForToken(`${userId}`);
    const token = generateToken(userForToken);
    mockUser2.likes.push(userId);
    await mockUser2.save();
    const response = await request(app).put(`/user/${id}/like`).set('Authorization', `Bearer ${token}`);

    expect(response.status).equals(httpStatusCode.BAD_REQUEST);
  });

  it('should unlike a specified user', async () => {
    const { _id: id } = mockUser2;
    const { _id: userId } = mockUser1;
    const userForToken = new UserForToken(`${userId}`);
    const token = generateToken(userForToken);
    mockUser2.likes.push(userId);
    await mockUser2.save();
    const response = await request(app).put(`/user/${id}/unlike`).set('Authorization', `Bearer ${token}`);
    expect(response.status).equals(httpStatusCode.OK);
  });

  it('should return forbidden if a user tries to unlike itself', async () => {
    const { _id: id } = mockUser1;
    const userForToken = new UserForToken(`${id}`);
    const token = generateToken(userForToken);
    const response = await request(app).put(`/user/${id}/unlike`).set('Authorization', `Bearer ${token}`);
    expect(response.status).equals(httpStatusCode.BAD_REQUEST);
  });

  it('should return forbidden when un-like a user that you did not like', async () => {
    const { _id: id } = mockUser2;
    const { _id: userId } = mockUser1;
    const userForToken = new UserForToken(`${userId}`);
    const token = generateToken(userForToken);
    const response = await request(app).put(`/user/${id}/unlike`).set('Authorization', `Bearer ${token}`);
    expect(response.status).equals(httpStatusCode.BAD_REQUEST);
  });

  it('should return list users in a most liked to least liked', async () => {
    mockUser2.likes.push(mockUser1._id);
    await mockUser2.save();
    const response = await request(app).get('/most-liked');
    expect(response.status).equals(httpStatusCode.OK);
    expect(response.body.result.result[0].likes.length).greaterThan(response.body.result.result[1].likes.length);
  });
});
