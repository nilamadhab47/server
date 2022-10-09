const express = require('express');
const router = express.Router();
const eventController = require('./controllers/eventFormController')
const bannerController = require('./controllers/bannerFormController')
const bannerModel =require("./models/bannerSchema")
const eventModel =require("./models/eventSchema")

/////////CREATE//////////

router.post('/api/createEvents' , eventController.createEvent) 
router.post('/api/createBanners' , bannerController.createBanner)

////////GET//////////// 
router.get("/api/getBanners/:id", async (req, res) => {
	try {
		const getBanner = await bannerModel.findOne({ _id: req.params.id })
	res.send(getBanner)
	} catch {
		res.status(404)
		res.send({ error: "event doesn't exist!" })
	}
})
router.get("/api/getEvents/:id", async (req, res) => {
	try {
		const getEvent = await eventModel.findOne({ _id: req.params.id })
	res.send(getEvent)
	} catch {
		res.status(404)
		res.send({ error: "event doesn't exist!" })
	}
})
router.get('/api/getAllEvents', eventController.getAllEvents)
router.get('/api/getAllBanners', bannerController.getAllBanners)


////////DELETE//////////

router.delete('/api/deleteEvents/:id', eventController.deleteEvent)
router.delete('/api/deleteBanners/:id', bannerController.deleteBanner)


/////////UPDATE///////////////

router.put('/api/updateEvents/:id', eventController.updateEvent)
router.put('/api/updateBanners/:id', bannerController.updateBanner)




module.exports = router;