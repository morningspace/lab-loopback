'use strict';

module.exports = function(app) {
  const Task = app.models.Task;
  Task.afterRemote('getList', function(ctx, unused, next) {
    ctx.res.header('X-TaskMe', 'This is a test');
    next();
  });

  app.datasources.db.autoupdate();
};
