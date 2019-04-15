const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
  origin: 'https://upload-arquivos-frontend.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors());
//app.options( whitelist, cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('connectRoom', box => {
    socket.join(box);
  });
});

mongoose.connect('mongodb+srv://djamilson:Kwpx5RX_tw!uvG-@cluster0-exrjh.mongodb.net/uploadfotos?retryWrites=true', {
  useNewUrlParser: true
});

const ALLOWED_ORIGINS = [
  'https://upload-arquivos-frontend.herokuapp.com',
  'http://localhost:3000'
]

app.use((req, res, next) => {
  
  if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
    res.set('Access-Control-Allow-Credentials', 'true')
    res.set('Access-Control-Allow-Origin', req.headers.origin)
  } else { // allow other origins to make unauthenticated CORS requests
    res.set('Access-Control-Allow-Origin', '*')        
  }

   // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
  req.io = io;

  return next();
});


app.use(express.json()); //para enviar json
app.use(express.urlencoded({ extended: true })); //para envia arquivos de fotos
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);