const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
const multer  = require('multer');
const {extractCommandName} = require("./src/js/utils");
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
    isFavourite: false
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

server.use(jsonServer.bodyParser);
server.post('/command', (req, res) => {
  const { message } = req.body;

  const userResource = router.db.get('messages').insert({
    type: 'text',
    content: message,
    author: 'user',
    timestamp: Date.now(),
    isFavourite: false
  }).value();

  const commandName = extractCommandName(message);

  let botResponse = '';
  switch (commandName) {
    case 'список':
      botResponse = 'Доступные команды: погода, курс валют, гороскоп, время, праздники';
      break;

    case 'погода':
      const degree = Math.floor(Math.random() * 35);

      botResponse = `Температура воздуха +${degree} C`;
      break;
    case 'курс валют':
      const rate = Math.floor(Math.random() * 35) + 55;
      const cents = Math.floor(Math.random() * 99);

      botResponse = `Курс доллара: 1 USD = ${rate}.${cents} RUB`;
      break;
    case 'гороскоп':
      const answers = [
        'Сегодня вам повезет',
        'Вас ждут путешествия',
        'Солнце будет вам сиять',
        'Не бойтесь действовать',
        'Лучше воздержаться от публичных выступлений',
        'Обратите внимание на свое здоровье',
        'Советуем выучить JavaScript'
      ];
      const rnd = Math.floor(Math.random() * 7);

      botResponse = answers[rnd];
      break;
    case 'время':
      const date = new Date();
      botResponse = `Текущее время ${date}`;
      break;
    case 'праздники':
      const holidays = [
        'Новый год',
        'День программиста',
        'День святой коровы',
        'День Спанч Боба',
        'Ваш День Рождения',
        'Веселая пятница',
      ];
      const rndIdx = Math.floor(Math.random() * 6);

      botResponse = `Сегодня ${holidays[rndIdx]}`;
      break;

    default:
      botResponse = `Команда "${commandName}" не найдена. Доступные команды: погода, курс валют, гороскоп, время, праздники`;
  }

  const botResource = router.db.get('messages').insert({
    type: 'text',
    content: botResponse,
    author: 'bot',
    timestamp: Date.now(),
    isFavourite: false
  }).value();

  router.db.write();

  res.status(200);
  res.send([userResource, botResource]);
});

server.use(router);

server.listen(port);
