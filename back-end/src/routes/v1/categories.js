import {Router} from 'express';
import Categories from '../../models/categories';
import authenfication from '../../middlewares/authenfication';

const router = Router();

router.use(authenfication);
router.get('/', (req, res, next) => {
    Categories.find({}, '-_id')
        .then(c => res.APISuccess(200, c))
        .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
});

router.get('/:slug', (req, res, next) => {
    const {slug} = req.params;
    
    Categories.findOne({slug}, '-_id')
        .then(c => {
            if(!c)
                return res.APIError('NON_EXISTENT_CATEGORY');
            
            return res.APISuccess(200, c);
        })
        .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
});

export default router;