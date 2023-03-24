const { Router } = require("express");
const {
	getCalendarMonth,
	postDescriptionCalendar,
} = require("../controllers/calendar.controller");

const router = Router();

router.get("/getCalendar", getCalendarMonth);
router.post("/postDescriptionCalendar", postDescriptionCalendar);

exports.Router = router;
