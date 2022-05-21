const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);

server.get('/command', (req, res) => {
  const resource = router.db.get('messages').insert({
    type: 'text',
    content: 'Bot response',
    author: 'bot',
    timestamp: Date.now(),
  }).value();

  router.db.write();

  res.status(201);
  res.send(resource);
});

server.use(router);

server.listen(port);
