// Receta
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let recetaSchema = new Schema({
    nombrePaciente: {
        type: String,
        required: [true, 'El nombre del paciente es necesario']
    },
    nombreMedico: {
        type: String,
        required: [true, 'El nombre del medico es necesario']
    },
    padecimiento: {
        type: String,
        required: [true, 'El padecimiento es necesario']
    },
    diagnostico: {
        type: String,
        required: [true, 'El diagnostico es necesario']
    },
    tratamiento: {
        type: String,
        required: [true, 'El tratamiento es necesario']
    },
    analisis: {
        type: String,
        required: [true, 'El analisis es necesario']
    },
    resultadoAnalisis: {
        type: String,
        required: [true, 'El resultadoAnalisis es necesario']
    },
    medicamento: {
        type: String,
        required: [true, 'El medicamento es necesario']
    },
    cedula: {
        type: String,
        required: [true, 'La cedula es necesaria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

/*recetaSchema.methods.toJSON = function() {
    let receta = this;
    let recetaObject = receta.toObject();

    return recetaObject;
}

recetaObjectSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' })*/

module.exports = mongoose.model('Receta', recetaSchema);