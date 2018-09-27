//Módulos 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');

//Rotas filhos
var adminAutoresRouter = require('./routers/adminAutorRouter');
app.use('/admin/autores', adminAutoresRouter);

app.set('view engine', 'ejs');

app.set('usuario', {nome: ''});

//Roteamentos
app.use('/public', express.static('./public'));
//var artigos = require('./routes/artigos');

app.get('/', function(req, res){
    res.redirect('/artigos');
});

app.get('/artigos', function(req, res){
    res.render('artigos', {usuario: app.get('usuario')});
});

app.get('/login', function(req, res){
    res.render('login', {usuario: app.get('usuario')});
});

app.post('/login', urlEncodedParser, function(req, res){
    if(req.body.email == 'rodrigo@gmail.com' && req.body.senha == '1234'){
        app.set('usuario', {nome: 'Rodrigo Barbosa'});
        res.redirect('/admin/artigos');
    }
    else{
        res.render('logininvalido', {usuario: app.get('usuario')});
    }
});

app.get('/logout', function(req, res){
    app.set('usuario', {nome: ''});
    res.redirect('/artigos');
});

app.listen(3000);