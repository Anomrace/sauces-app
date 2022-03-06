const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const MaskData = require('maskdata');

const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
};

const User = require('../models/user')
exports.signup = (req, res, next) => {
    let password = req.body.password
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: MaskData.maskEmail2(req.body.email, emailMask2Options),
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur crée'
                }))
                .catch(error => res.status(400).json({
                    error
                }))
        }).catch(error => res.status(500).json({
            message: 'les données sont vide'
        }));
}

exports.login = (req, res, next) => {
    User.findOne({
            email: MaskData.maskEmail2(req.body.email, emailMask2Options)
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                        {userId: user.id},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'})
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }))
}

