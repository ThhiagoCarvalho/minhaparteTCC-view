const express = require('express');
const ControlAtestado = require('../controle/controleAtestado');
const MiddlewareAtestado = require('../middleware/middlewareAtestado');

module.exports = class RouterAtestado {
    constructor() {
        this._router = express.Router();
        this._controleAtestado = new ControlAtestado();
        this._middleAtestado = new MiddlewareAtestado();
    }

    criarRotasAtestado() {
        this._router.post ('/csv' ,
            this._controleAtestado.controle_post_atestado
        ) 
        return this._router
    }
};
