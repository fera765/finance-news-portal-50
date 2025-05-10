
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);

// Add custom routes if needed
// server.get('/custom-route', (req, res) => {
//   res.jsonp({ custom: 'data' });
// });

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
