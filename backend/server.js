require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const galeryRoute = require('./routes/galery');
const produkRoute = require('./routes/produk');
const artikelRoute = require('./routes/artikel');
const tagsRoute = require('./routes/tags');
const articleTagsRoute = require('./routes/artikel_tags');
const profilRoute = require('./routes/profil_perusahaan');
const adminRoute = require('./routes/admin');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const imgPath = path.resolve(__dirname, "public/img");
console.log("Serving static files from:", imgPath);
app.use(
    "/img",
    express.static(imgPath, {
      setHeaders: (res, path) => {
        res.set("Access-Control-Allow-Origin", "*");
      },
    })
  );
app.use('/api', galeryRoute, produkRoute, artikelRoute, tagsRoute, articleTagsRoute, profilRoute, adminRoute );

app.get('/', (req, res) => {
    res.send({ message: 'API is running...' });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
