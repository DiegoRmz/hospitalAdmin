// Doctor
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let doctorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    especialidad: {
        type: String,
        required: [true, 'La especialidad es necesaria']
    },
    cedula: {
        type: String,
        required: [true, 'La cedula es necesaria']
    },
    equipo: {
        type: String,
        required: [true, 'El equipo es necesario']
    },
    universidad: {
        type: String,
        required: [true, 'La universidad es necesaria']
    },
    afiliacion: {
        type: String,
        required: [true, 'La afiliacion es necesaria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

doctorSchema.methods.toJSON = function() {
    let doctor = this;
    let doctorObject = doctor.toObject();
    delete doctorObject.password;

    return doctorObject;
}

doctorSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' })

module.exports = mongoose.model('Doctor', doctorSchema);