import {Router} from 'express';
import Redactors from '../../models/redactors';
import authenfication from '../../middlewares/authenfication';

const router = Router();

router.use(authenfication);
router.route('/')
    .get((req, res, next) => {
        Redactors.find({}, '-_id -email -password')
            .then(c => res.APISuccess(200, c))
            .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
    });

router.route('/:slug')
    .get((req, res, next) => {
        const {slug} = req.params;
        
        Redactors.findOne({slug}, '-_id -email -password')
            .then(c => {
                if(!c)
                    return res.APIError('NON_EXISTENT_REDACTOR');
                
                return res.APISuccess(200, c);
            })
            .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
    });

export default router;