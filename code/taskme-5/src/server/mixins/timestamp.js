module.exports = (Model) => {
  Model.defineProperty('created', { type: Date, defaultFn: 'now' });
  Model.defineProperty('modified', { type: Date, defaultFn: 'now' });

  Model.observe('before save', (ctx, next) => {
    const model = ctx.instance ? ctx.instance : ctx.data;
    model.modified = new Date();
    next();
  });
};
