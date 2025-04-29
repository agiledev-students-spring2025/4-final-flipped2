import { expect } from 'chai';
import request from 'supertest';
import { app } from './server.mjs';

const testEmail = `test+${Date.now()}@nyu.eduZ`;
const testPassword = '123456';
let taskId = null;
let createdEventId = null;

describe('Login & Signup API', () => {
  it('POST /api/signup should register a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
  });

  it('POST /api/login should allow valid login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
  });

  it('POST /api/login should reject invalid login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@example.com', password: 'wrong' });

    expect(res.status).to.equal(401);
    expect(res.body.status).to.equal('fail');
  });

  it('POST /api/signup with existing email should fail', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('fail');
  });
});

describe('ToDo API', () => {
  it('POST /api/tasks should create a new task', async () => {
    const newTask = {
      title: 'New Task',
      status: 'todo',
      deadline: '2025-03-25',
      userEmail: testEmail
    };

    const res = await request(app).post('/api/tasks').send(newTask);
    expect(res.status).to.equal(201);
    expect(res.body.title).to.equal(newTask.title);
    taskId = res.body._id;
  });

  it('GET /api/tasks should return all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .query({ userEmail: testEmail });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/tasks/:status should return tasks by status', async () => {
    const res = await request(app)
      .get('/api/tasks/todo')
      .query({ userEmail: testEmail });

    expect(res.status).to.equal(200);
    expect(res.body.every(task => task.status === 'todo')).to.be.true;
  });

  it('GET /api/task/:id should return the task', async () => {
    const res = await request(app)
      .get(`/api/task/${taskId}`)
      .query({ userEmail: testEmail });

    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(taskId);
  });

  it('GET /api/task/:id should return 404 if not found', async () => {
    const res = await request(app)
      .get('/api/task/000000000000000000000000')
      .query({ userEmail: testEmail });

    expect(res.status).to.equal(404);
  });

  it('POST /api/tasks should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Incomplete Task' });

    expect(res.status).to.equal(400);
  });

  it('PUT /api/tasks/:id should update task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        status: 'in-progress',
        deadline: '2025-03-28',
        userEmail: testEmail
      });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('Updated Task');
  });

  it('PUT /api/tasks/:id should return 404 for invalid ID', async () => {
    const res = await request(app)
      .put('/api/tasks/000000000000000000000000')
      .send({ title: 'X', userEmail: testEmail });

    expect(res.status).to.equal(404);
  });

  it('PATCH /api/tasks/:id/status should update status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .send({ status: 'done', userEmail: testEmail });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('done');
  });

  it('PATCH /api/tasks/:id/status should fail on missing body', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .send({});

    expect(res.status).to.equal(400);
  });

  it('DELETE /api/tasks/:id should delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .query({ userEmail: testEmail });

    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(taskId);
  });

  it('DELETE /api/tasks/:id should 404 if not found', async () => {
    const res = await request(app)
      .delete('/api/tasks/000000000000000000000000')
      .query({ userEmail: testEmail });

    expect(res.status).to.equal(404);
  });

  it('GET /api/calendar should return calendar data', async () => {
    const res = await request(app).get('/api/calendar');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('dates');
    expect(res.body).to.have.property('tasks');
  });
});

describe('Pomodoro API', () => {
  const testUserId = 'testuser';

  it('POST /api/start-session should start session', async () => {
    const res = await request(app)
      .post('/api/start-session')
      .send({ userId: testUserId });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Session started successfully.');
  });

  it('POST /api/end-session should return tarot card', async () => {
    const res = await request(app)
      .post('/api/end-session')
      .send({ userId: testUserId });

    expect(res.status).to.equal(200);
    expect(res.body.reward).to.be.an('object');
  });

  it('POST /api/end-session should return quote for same day', async () => {
    const res = await request(app)
      .post('/api/end-session')
      .send({ userId: testUserId });

    expect(res.status).to.equal(200);
    expect(res.body.reward).to.be.a('string');
  });

  it('POST /api/end-session with no userId still works', async () => {
    const res = await request(app).post('/api/end-session').send({});
    expect(res.status).to.equal(200);
    expect(res.body.reward).to.be.an('object');
  });
});

describe('Events API', () => {
  it('GET /api/events without userEmail should fail', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/events missing title/date/time should fail', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Oops', userEmail: testEmail });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/events should create event', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'Unit Test Event',
        date: '2025-05-01',
        time: '10:30',
        userEmail: testEmail
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    createdEventId = res.body._id;
  });

  it('PUT /api/events/:id should update event', async () => {
    const res = await request(app)
      .put(`/api/events/${createdEventId}`)
      .send({ title: 'Updated Event' });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('Updated Event');
  });

  it('DELETE /api/events/:id should delete event', async () => {
    const res = await request(app).delete(`/api/events/${createdEventId}`);
    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(createdEventId);
  });

  it('DELETE /api/events/:id again should return 404', async () => {
    const res = await request(app).delete(`/api/events/${createdEventId}`);
    expect(res.status).to.equal(404);
  });
});
