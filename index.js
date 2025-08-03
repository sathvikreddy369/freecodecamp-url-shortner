require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require('body-parser');//wr
let urlDatabase={};//wr
let currentid=1;//wr



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended:false}));//wr
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//wr---
const dns=require('dns');
const urlParser=require('url');
app.post('/api/shorturl',(req,res)=>{
  const  originalUrl=req.body.url;
  const hostname=urlParser.parse(originalUrl).hostname;
  dns.lookup(hostname,(err)=>{
    if(err){
      return res.json({error:'invalid url'});
    }
    const shortUrl=currentid++;
    urlDatabase[shortUrl]=originalUrl;
    res.json({
      original_url:originalUrl,
      short_url: shortUrl
    });
  });
});
app.get('/api/shorturl/:id',(req,res)=>{
  const shorturl=req.params.id;
  const originalurl=urlDatabase[shorturl];
  if(originalurl){
    res.redirect(originalurl);
  }else{
    res.json({error:'No short Url founf for given input'});
  }
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
