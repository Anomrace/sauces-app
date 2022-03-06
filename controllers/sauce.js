
const Sauce = require('../models/Sauce')
const fs = require('fs')


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : []
    })
    sauce.save()
    .then(() => res.status(201).json({ message: 'objet enregistré'}))
    .catch(error => res.status(400).json({ error }))
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(Sauce =>  res.status(200).json(Sauce))
    .catch(error => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() =>  res.status(200).json({message : 'Objet modifié'}))
    .catch(error => res.status(400).json({ error }))
}

exports.likeSauce = (req, res, next) => {

    if(req.body.like === 1){
        
        Sauce.updateOne({ _id: req.params.id}, {$addToSet : {usersLiked: req.body.userId}, $inc : {likes: 1}})
        .then(() =>  res.status(200).json({ message : 'sauce disliké'}))
        .catch(error => res.status(400).json({ error }))
       
    }
    else if (req.body.like === -1 ){
        Sauce.updateOne({ _id: req.params.id}, {$addToSet : {usersDisliked: req.body.userId}, $inc : {dislikes: 1}})
        .then(() =>  res.status(200).json({ message : 'sauce disliké'}))
        .catch(error => res.status(400).json({ error }))
    }
    
    else if (req.body.like === 0){
        Sauce.findOne({_id: req.params.id})
        .then(Sauce => {
            res.status(200).json()
            if(Sauce.usersLiked.includes(req.body.userId)){
                
                // Traitement si like
            Sauce.updateOne({ $pull : {usersLiked : req.body.userId} , $inc : {likes : -1} })
            .then(() =>  res.status(201).json())
            .catch(error => res.status(401).json({ error }))
            }
            else if (Sauce.usersDisliked.includes(req.body.userId)){
                //Traitement si dislike
                Sauce.updateOne({ $pull : {usersDisliked : req.body.userId} , $inc : {dislikes : -1}})
            .then(() =>  res.status(202).json())
            .catch(error => res.status(402).json({ error }))
            }
            
        })
        .catch(error => res.status(400).json({ error }))

        
   }

   



}

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images')[1]
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id})
            .then(sauce =>  res.status(200).json({message : 'Objet supprimé'}))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({ error }))
    
}