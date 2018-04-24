'use strict';

module.exports = function(Task) {

  Task.validatesLengthOf('title', { min: 1, max: 64});
  Task.validatesInclusionOf('state', {
    in: [0, 1], message: 'is not allowed'
  });

  Task.observe('before save', function formatTitile(ctx, next) {
    const model = ctx.instance ? ctx.instance : ctx.data;

    if (model.title) {
      model.title = model.title.toUpperCase();
    }

    next();
  });

  /**
   * Get a list of tasks.
   * @param {string} state State of task. Valid value can be 'undone' or 'done'.
   * @param {number} page Current page number.
   * @param {number} pageSize Number of tasks per page.
   * @param {string} order Sort by specified fields, separated by comma.
   * @param {string} fields Fields to be displayed, separated by comma.
   * @param {Function(Error, array)} cb
   */
  Task.getList = function(state, page, pageSize, order, fields, cb) {
    const where = { state: (state === 'done') ? 1 : 0 };
    const limit = pageSize || 100;
    const skip = ((page || 1) - 1) * limit;

    const query = { where, limit, skip };

    if (order) {
      query.order = [];
      order.split(',').forEach(function(item) {
        query.order.push(item);
      });
    }

    if (fields) {
      query.fields = {};
      fields.split(',').forEach(function(item) {
        query.fields[item] = true; 
      });
    }

    Task.find(query, cb) ;
  };

  /**
   * Search a list of tasks.
   * @param {string} q The keyword to be searched.
   * @param {Function(Error, array)} cb
   */
  Task.search = function(q, cb) {
    const connector = Task.getDataSource().connector;
    const collection = connector.db.collection('tasks');
    const query = {
      "$text": {
        "$search": q,
      }
    };
    
    return collection.find(query).toArray(function(err, items) {
      const tasks = items.map(function(item) {
        return new Task(item);
      });
      cb(err, tasks);
    });
  }
};
