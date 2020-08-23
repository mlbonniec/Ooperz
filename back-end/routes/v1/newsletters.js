import {Router} from 'express';
import Newsletters from '../../models/newsletters';
import authenfication, {privateAuth, publicAuth} from '../../middlewares/authenfication'

const router = Router();

router.get('/', privateAuth, (req, res, next) => {
    Newsletters.find({}, '-_id')
        .then(n => res.APISuccess(200, n))
        .catch(err => res.APIError('INTERNAL_ERROR'));
});

router.route('/:email')
    .get(privateAuth, (req, res, next) => {
        const {email} = req.params;

        Newsletters.findOne({email}, '-_id')
            .then(n => {
                if(!n)
                    return res.APIError('SUBSCRIBER_DOESNT_EXIST');

                res.APISuccess(200, n)
            })
            .catch(err => res.APIError('INTERNAL_ERROR'));
    })
    .post(authenfication, (req, res, next) => {
        const {email} = req.params;

        Newsletters.findOne({email})
            .then(n => {
                if(n)
                    return res.APIError('SUBSCRIBER_ALREADY_REGISTERED');

                Newsletters.create({email})
                    .then(n => res.APISuccess(204))
                    .catch(err => res.APIError('INTERNAL_ERROR'));
            })
            .catch(err => res.APIError('INTERNAL_ERROR'));
    })
    .delete((req, res, next) => {
        const {email} = req.params;
        const {token} = req.query;

        if(!token)
            return res.APIError('MISSING_PARAMETERS');

        Newsletters.findOne({email})
            .then(n => {
                if(!n)
                    return res.APIError('SUBSCRIBER_DOESNT_EXIST');

                if(n.token !== token)
                    return res.APIError('INVALID_SUBSCRIBER_TOKEN');
                
                Newsletters.deleteOne({email})
                    .then(n => res.APISuccess(204))
                    .catch(err => res.APIError('INTERNAL_ERROR'));
            })
            .catch(err => res.APIError('INTERNAL_ERROR'));
    });

export default router;