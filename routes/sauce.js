const express = require('express')
const router = express.Router()
const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// cherche et renvoi toutes les sauces 
router.get('/', auth, sauceCtrl.getAllSauce)

// cherche et affiche une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce)

// Capture et enregistre l'image, 
// analyse la sauce en utilisant une chaine et
// l'enregistre dans la base de donnée 
// en définissant correctement son image url
// remet les sauces aimées et detestée à zero et
// les sauces usersliked et celles de usersdislike
// aux tableaux vides
router.post('/', auth, multer, sauceCtrl.createSauce)


// Met à jour la sauce avec
// l'identifiant fourni. Si
// une image est
// téléchargée, capturez-la
// et mettez à jour l'image
// URL des sauces. Si
// aucun fichier n'est
// fourni, les détails de la
// sauce figurent
// directement dans le
// corps de la demande
// (req.body.name,
// req.body.heat etc). Si
// un fichier est fourni, la
// sauce avec chaîne est
// en req.body.sauce.
router.put('/:id', auth, multer, sauceCtrl.modifySauce)

// Supprime la sauce avec
// l'ID fourni.
router.delete('/:id', auth, sauceCtrl.deleteOneSauce)


// Définit le statut
// "j'aime" pour userID
// fourni. Si j'aime = 1,
// l'utilisateur aime la
// sauce. Si j'aime = 0,
// l'utilisateur annule ce
// qu'il aime ou ce qu'il
// n'aime pas. Si j'aime =-1, l'utilisateur n'aime
// pas la sauce.
// L'identifiant de
// l'utilisateur doit être
// ajouté ou supprimé du
// tableau approprié, en
// gardant une trace de
// ses préférences et en
// l'empêchant d'aimer ou
// de ne pas aimer la
// même sauce plusieurs
// fois. Nombre total de
// "j'aime" et de "je n'aime
// pas" à mettre à jour
// avec chaque "j'aime".
router.post('/:id/like', auth, sauceCtrl.likeSauce)


module.exports = router