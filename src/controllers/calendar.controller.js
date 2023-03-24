const { pool } = require("../database");
const { clienteAxios } = require("../axios");
const { config } = require("dotenv");
config();

async function getCalendarMonth(req, res) {
	const { year, month } = req.query;
	try {
		if (!year) throw new Error("Year is required");
		if (!month) throw new Error("Month is required");
		getDataFromNasa(year, month)
			.then(async (resp) => {
				const promiseCalendar = resp.data.map( async (dataCalendarDay) => {
					const arrayDescriptions = await getDescriptionsFromDB(
						dataCalendarDay.date
					);
					return {
						...dataCalendarDay,
						description: arrayDescriptions,
					};
				});
				const resolvedCalendar  = await Promise.all(promiseCalendar);

				const calendarArray = resolvedCalendar.map((dataCalendarDay) => {
					return {
					  ...dataCalendarDay,
					  description: dataCalendarDay.description,
					};
				  });

				return res.status(200).json({
					status: 200,
					statusText: "ok",
					calendar: calendarArray,
				});
			})
			.catch((err) => {
				return res.status(440).json({
					status: 440,
					statusText: "fail",
					error: err,
				});
			});
	} catch (err) {
		return res.status(440).json({
			status: 440,
			statusText: "fail",
			error: err,
		});
	}
}

async function postDescriptionCalendar(req, res) {
	const { description, author, date } = req.body;
	try {
		if (!date) throw new Error("date is required");
		if (!description) throw new Error("description is required");
		if (!author) throw new Error("author is required");
		putDescriptionDB(description, author, date)
			.then((resp) => {
				return res.status(200).json({
					status: 200,
					statusText: "ok",
				});
			})
			.catch((err) => {
				return res.status(500).json({
					status: 500,
					statusText: "fail",
					error: err,
				});
			});
	} catch (err) {
		return res.status(440).json({
			status: 440,
			statusText: "fail",
			error: err,
		});
	}
}

function putDescriptionDB(description, author, date) {
	const queryDB = `
    INSERT INTO description(
    description, date, author)
	VALUES ( $1, $2, $3);`;
	return pool.query(queryDB, [description, date, author]);
}

async function getDescriptionsFromDB(date) {
	const queryDB = `SELECT id, description, author FROM  description WHERE date = $1`;
	const response = await pool.query(queryDB, [date]);
	return response.rows;
}

function getDataFromNasa(year, month) {
	const header = `/apod?api_key=${
		process.env.API_KEY || ""
	}&start_date=${year}-${month}-01&end_date=${year}-${month}-${getEndDay(
		year,
		month
	)}`;
	return clienteAxios.get(header);
}

function getEndDay(year, month) {
	const fecha = new Date(year, month, 0);
	return fecha.getDate();
}

exports.getCalendarMonth = getCalendarMonth;
exports.postDescriptionCalendar = postDescriptionCalendar;
