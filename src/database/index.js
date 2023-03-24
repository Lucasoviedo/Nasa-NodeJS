const { Pool } = require("pg");

const pool = new Pool({
	host: "localhost",
	user: "postgres",
	password: "lucas123",
	database: "Nasa",
});

exports.pool = pool;
