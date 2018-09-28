//Módulos 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');

//Models
var AutorModel = require('./models/autormodel');

app.set('usuario', {id: null, nome: '', admin: false});

//Rotas filhos
var adminAutoresRouter = require('./routers/adminAutorRouter');
app.use('/admin/autores', adminAutoresRouter);
var adminArtigosRouter = require('./routers/adminArtigoRouter');
app.use('/admin/artigos', adminArtigosRouter);

app.set('view engine', 'ejs');

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
    AutorModel.findOne({email: req.body.email}, function(erro, autor){
        if(erro) return console.error(erro);
        if(autor){
            if(req.body.senha == autor.senha){
                app.set('usuario', {id: autor._id, nome: autor.nome, admin: autor.admin});
                res.redirect('/admin/artigos');
                return;
            }
        }
        res.render('logininvalido', {usuario: app.get('usuario')});
    });
});

app.get('/logout', function(req, res){
    app.set('usuario', {id: null, nome: '', admin: false});
    res.redirect('/artigos');
});

app.listen(3000);