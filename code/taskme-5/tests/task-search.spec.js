const app = require('../src/server/server');
const dsSettings = require('../src/server/datasources.production.json');

describe('Model Task search', () => {
  const objectContains = jasmine.objectContaining;
  const Task = app.models.Task;
  const originalDS = Task.dataSource;
  const TASK = {
    title: 'foo',
    description: 'bar',
  };
  const EXPECTED = {
    title: 'FOO',
    description: 'bar',
  };
  let taskId;

  beforeAll((done) => {
    const newDS = app.loopback.createDataSource('db', dsSettings.db);
    Task.attachTo(newDS);
    newDS.autoupdate();

    Task
    .create(TASK)
    .then((res) => { taskId = res.id; })
    .then(done);
  });

  afterAll((done) => {
    Task
    .destroyById(taskId)
    .then(done);

    Task.attachTo(originalDS);
  });

  it('should work', (done) => {
    Task
    .search('FOO')
    .then((res) => {
      expect(res[0].toObject()).toEqual(objectContains(EXPECTED));
    })
    .then(done);
  });
});
