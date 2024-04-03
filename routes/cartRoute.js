const express = require('express')
const router = express.Router()
const pages = require('../controllers/cartController.js')
const formidable = require("express-formidable");
const { isAuthenticatedUser } = require('../middlewares/authMiddlewaresUser.js');

router.route('/add-cartproducts/:id').post(isAuthenticatedUser,pages.addProductsInCart)
router.route('/show-cartproducts').get(isAuthenticatedUser,pages.showProductsInCart)
router.route('/delete-cartproduct/:id').delete(isAuthenticatedUser,pages.deleteProductFromCart)
router.route('/quantity/:id').put(isAuthenticatedUser,pages.updateQuantity);
// router.route("/update-team/:pid").put(formidable(),pages.updateTeamController);
// router.route("/get-team").get(pages.getTeamController)
// router.route("/team-photo/:pid").get(pages.teamPhotoController)
// router.route("/delete-team/:pid").delete(pages.deleteTeamController)

module.exports = router