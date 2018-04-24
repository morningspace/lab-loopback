module.exports = (Model) => {
  const Task = Model;
  Task.validatesLengthOf('title', { min: 1, max: 64 });
  Task.validatesInclusionOf('state', {
    in: [0, 1], message: 'is not allowed',
  });

  Task.observe('before save', (ctx, next) => {
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
  Task.getList = (state, page, pageSize, order, fields, cb) => {
    const where = { state: (state === 'done') ? 1 : 0 };
    const limit = pageSize || 100;
    const skip = ((page || 1) - 1) * limit;

    const query = { where, limit, skip };

    if (order) {
      query.order = [];
      order.split(',').forEach((item) => {
        query.order.push(item);
      });
    }

    if (fields) {
      query.fields = {};
      fields.split(',').forEach((item) => {
        query.fields[item] = true;
      });
    }

    return Task.find(query, cb);
  };

  /**
   * Search a list of tasks.
   * @param {string} q The keyword to be searched.
   * @param {Function(Error, array)} cb
   */
  Task.search = (q) => {
    const connector = Task.getDataSource().connector;
    if (connector.name === 'mongodb') {
      const collection = connector.db.collection('tasks');
      const query = {
        $text: {
          $search: q,
        },
      };

      return new Promise((resolve) => {
        collection.find(query).toArray((err, items) => {
          const tasks = items.map(item => new Task(item));
          resolve(tasks);
        });
      });
    }
    return Promise.resolve([]);
  };
};
