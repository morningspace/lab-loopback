const app = require('../src/server/server');
const supertest = require('supertest');

const request = supertest(app);

describe('Model Task remote methods', () => {
  const objectContains = jasmine.objectContaining;
  const TASK = {
    title: 'my task',
    description: 'This is my task',
  };
  const EXPECTED = {
    title: 'MY TASK',
    description: 'This is my task',
  };
  let taskId = null;

  it('should get 401 if no login', (done) => {
    request.get('/api/tasks')
    .expect(401)
    .end((err) => {
      if (err) fail(err);
      done();
    });
  });

  it('should get 200 if login', (done) => {
    request.get('/api/tasks?access_token=sometoken')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      else expect(res.body).toEqual([]);
      done();
    });
  });

  it('should get 200 if post a task', (done) => {
    request.post('/api/tasks?access_token=sometoken')
    .send(TASK)
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      else {
        expect(res.body).toEqual(objectContains(EXPECTED));
        taskId = res.body.id;
      }
      done();
    });
  });

  it('should get 200 if query undone tasks', (done) => {
    request.get('/api/tasks/undone?access_token=sometoken')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      else {
        expect(res.body.length).toEqual(1);
        expect(res.body[0]).toEqual(objectContains(EXPECTED));
      }
      done();
    });
  });

  it('should get 200 if delete the posted task', (done) => {
    request.delete(`/api/tasks/${taskId}?access_token=sometoken`)
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      else expect(res.body).toEqual({ count: 1 });
      done();
    });
  });
});
