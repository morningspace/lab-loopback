module.exports = (app) => {
  const Task = app.models.Task;
  Task.afterRemote('getList', (ctx, unused, next) => {
    ctx.res.header('X-TaskMe', 'This is a test');
    next();
  });

  app.datasources.db.autoupdate();
};
