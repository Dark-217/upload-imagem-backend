const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');




const app = express();
//app.use(cors());
// Then pass them to cors:
app.use(cors());

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
// Website you wish to allow to connect
res.setHeader('Access-Control-Allow-Origin', 'https://upload-arquivos-banckend.herokuapp.com/boxes');

// Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);

// Pass to next layer of middleware

    req.io = io;

    return next();
});


app.use(express.json()); //para enviar json
app.use(express.urlencoded({ extended: true })); //para envia arquivos de fotos
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);