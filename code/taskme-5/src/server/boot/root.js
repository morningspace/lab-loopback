module.exports = (app) => {
  // Install a `/` route that returns server status
  const router = app.loopback.Router();
  router.get('/', app.loopback.status());
  app.use(router);
};
