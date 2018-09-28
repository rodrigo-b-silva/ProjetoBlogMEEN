var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema(
    {
        titulo: {type: String, required: true},
        autor: {
            id: Schema.Types.ObjectId,
            nome: String
        },
        criado: Date,
        atualizado: Date,
        resumo: String,
        texto: String,
        comentarios: [
            {
                nome: String,
                data: {type: Date, default: Date.now},
                curtiu: {type: Number, default: 0},
                naocurtiu: {type: Number, default: 0}
            }
        ]
    }
);

module.exports = mongoose.model('Artigo', modelSchema);