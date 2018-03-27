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

};
