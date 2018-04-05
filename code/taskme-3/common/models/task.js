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
   * @param {Function(Error, array)} callback
   */
  Task.getList = function(state, callback) {
    const query = {
      where: {
        state: (state === 'done') ? 1 : 0
      }
    };

    Task.find(query, callback) ;
  };

};
