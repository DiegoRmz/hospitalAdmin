// Paciente
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let pacienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    nss: {
        type: String,
        required: [true, 'El nss es necesario']
    },
    poliza: {
        type: String,
        required: [true, 'La poliza es necesaria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

pacienteSchema.methods.toJSON = function() {
    let paciente = this;
    let pacienteObject = paciente.toObject();

    return pacienteObject;
}

pacienteSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' })

module.exports = mongoose.model('Paciente', pacienteSchema);