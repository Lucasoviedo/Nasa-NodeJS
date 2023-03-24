const axios = require("axios");

const clienteAxios = axios.create({
	baseURL: "https://api.nasa.gov/planetary",
});

exports.clienteAxios = clienteAxios;
