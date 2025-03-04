const express = require('express');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
  aliasTopFiveCheap,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopFiveCheap, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, getAllTours)
  .post(checkBody, createTour);
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
