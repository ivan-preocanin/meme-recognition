const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const spawn = require('child_process').spawn;

const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });

const schema = new mongoose.Schema({
  img: Buffer,
  contentType: String,
  text: String
}, { collection: 'memes' });

const Meme = mongoose.model('Meme', schema);

app.get('/memes/:query', (req, res) => {
  const query = req.params.query;
  
  mongoose.connect('mongodb://localhost:27017/memes', { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    Meme.find({ text: query }).exec((error, docs) => {
      if (error) {
        res.status(404).send(error);
        return;
      }

      if (docs.length === 0) {
        res.status(404).send('NOT FOUND');
        return;
      }

      // const img = Buffer.from(docs[0].img, 'base64');
      // res.writeHead(200, {
      //   'Content-Type': docs[0].contentType,
      //   'Content-Length': img.length
      // });
      // res.end(img);

      const response = docs.map(doc => ({
        img: Buffer.from(doc.img, 'base64'),
        text: doc.text
      }));
      res.json(response);
    });
  });
});

// curl -F "data=@meme.png" http://localhost:3000/memes
app.post('/memes', upload.single('data'), (req, res) => {
  console.log(req.file);
  console.log('---------');

  const process = spawn('python', ['./recognize.py']);
  process.stdin.write(req.file.buffer);
  process.stdin.end();
  process.stdout.on('data', (data) => console.log(data.toString()));

  mongoose.connect('mongodb://localhost:27017/memes', { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    const meme = new Meme({
      img: req.file.buffer,
      contentType: req.file.mimetype,
      text: ''
    });

    meme.save((error, meme) => {
      if (error) {
        return console.error(error);
      }
      res.send('\n\nSAVED');
    })
  })
})

app.listen(port, () => console.log(`Memes ready on port ${port}!`));
