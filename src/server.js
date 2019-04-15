const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


// Set up a whitelist and check against it:
const whitelist = ['https://upload-arquivos-frontend.herokuapp.com', 'http://upload-arquivos-frontend.herokuapp.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


const app = express();
//app.use(cors());
// Then pass them to cors:
app.use(cors(corsOptions));

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    });
});

mongoose.connect('mongodb+srv://djamilson:1alvescosta@cluster0-exrjh.mongodb.net/uploadfotos?retryWrites=true',
    {
        useNewUrlParser: true
    });

app.use((req, res, next) => {
    req.io = io;

    return next();
});


app.use(express.json()); //para enviar json
app.use(express.urlencoded({ extended: true })); //para envia arquivos de fotos
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);