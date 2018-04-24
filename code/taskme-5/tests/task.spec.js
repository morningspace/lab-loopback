const app = require('../src/server/server');

describe('Model Task methods', () => {
  const objectContains = jasmine.objectContaining;
  const Task = app.models.Task;
  const TASK = {
    title: 'foo',
    description: 'bar',
  };
  const EXPECTED = {
    title: 'FOO',
    description: 'bar',
  };
  const EXPECTED_UPDATE = {
    title: 'FOO',
    description: 'updated bar',
  };
  let taskId;

  beforeAll((done) => {
    Task
    .create(TASK)
    .then((res) => { taskId = res.id; })
    .then(done);
  });

  afterAll((done) => {
    Task
    .destroyById(taskId)
    .then(done);
  });

  it('should return expected results when call getList with different params', (done) => {
    Task
    .getList('undone')
    .then((res) => {
      expect(res.length).toEqual(1);
      expect(res[0].toObject()).toEqual(objectContains(EXPECTED));
    })
    .then(() => Task.upsert({ id: taskId, description: 'updated bar' }))
    .then(() => Task.getList('undone', null, null, 'title desc', 'title,description'))
    .then((res) => {
      expect(res.length).toEqual(1);
      expect(JSON.parse(JSON.stringify(res[0].toObject()))).toEqual(EXPECTED_UPDATE);
    })
    .then(() => Task.getList('done'))
    .then((res) => {
      expect(res.length).toEqual(0);
    })
    .then(() => Task.search('FOO'))
    .then((res) => {
      expect(res.length).toEqual(0);
    })
    .then(done);
  });
});
