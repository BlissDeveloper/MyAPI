const express = require('express');
const { route } = require('../../app');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : "GET method of prodcuts",
        author: "Avery"
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message : "POST method of prodcuts",
        author: "Avery"
    });
});