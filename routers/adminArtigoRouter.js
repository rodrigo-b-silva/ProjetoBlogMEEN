var express = require('express');
var artigosRouter = express.Router();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var ArtigoModel = require('../models/artigomodel');

artigosRouter.use(function(req, res, next){
    if(req.app.get('usuario').id == null){
        res.redirect('/');
        return;
    }
    next();
});

artigosRouter.get('/', function(req, res){
    var usuario = req.app.get('usuario');
    var filtro = null;
    if(!usuario.admin){
        filtro = {'usuario.id': usuario.id};
    }
    ArtigoModel.find(filtro, null, {sort: {criado: -1}}, function(erro, artigos){
        if(erro) return console.error(erro);
        res.render('admin/artigos', {artigos: artigos, usuario: usuario})
        //res.json(autores);
    });
});

artigosRouter.get('/novo', function(req, res){
    res.render('admin/novoartigo', {usuario: req.app.get('usuario')});
});

artigosRouter.post('/novo', urlEncodedParser, function(req, res){
    var artigo = ArtigoModel({
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            nome: req.body.autor_nome
        },
        criado: new Date(),
        atualizado: null,
        resumo: req.body.resumo,
        texto: req.body.texto,
        comentarios: []
    });
    artigo.save(function(erro, artigo){
        if(erro) return console.error(erro);
        res.render('admin/artigoincluido', {usuario: req.app.get('usuario')});
    })
});

artigosRouter.get('/:id', function(req, res){
    ArtigoModel.findById(req.params.id, function(erro, artigo){
        res.render('admin/artigo', {artigo: artigo, usuario: req.app.get('usuario')});
    });
});

artigosRouter.post('/:id', urlEncodedParser, function(req, res){
    var artigo = ArtigoModel({
        _id: req.params.id,
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            nome: req.body.autor_nome
        },
        criado: req.body.criado,
        atualizado: Date.now,
        resumo: req.body.resumo,
        texto: req.body.texto,
        comentarios: JSON.parse(req.body.comentarios)
    });
    ArtigoModel.update({ _id: req.params.id }, artigo, function(erro){
        res.render('admin/artigoalterado', { usuario: req.app.get('usuario')});
    });
});

artigosRouter.get('/:id/excluir', function(req, res){
    ArtigoModel.remove({ _id: req.params.id }, function(erro){
        res.render('admin/artigoexcluido', { usuario: req.app.get('usuario')});
    });
});

module.exports = artigosRouter;