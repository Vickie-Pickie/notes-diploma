const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').reverse()[0];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
})
const upload = multer({ storage });

server.use(middlewares);

const saveMedia = (type, req, res) => {
  const { filename, originalname } = req.file;
  const resource = router.db.get('messages').insert({
    type,
    content: {
      fileName: `/uploads/${filename}`,
      originalName: originalname,
    },
    author: 'user',
    timestamp: Date.now(),
  }).value();

  router.db.write();

  res.status(201);
  res.send(resource);
};

server.post('/upload/image', upload.single('file'), function (req, res, next) {
  saveMedia('image', req, res);
});

server.post('/upload/video', upload.single('file'), function (req, res, next) {
  saveMedia('video', req, res);
});

server.post('/upload/audio', upload.single('file'), function (req, res, next) {
  saveMedia('audio', req, res);
});

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
