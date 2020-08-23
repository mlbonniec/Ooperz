import {Router} from 'express';
import Articles from '../../models/articles';
import Categories from '../../models/categories';
import authenfication, {isPrivate} from '../../middlewares/authenfication';
import {publicQueryString} from '../../helpers/queryString';

const router = Router();

router.route('/')
    .get(authenfication, (req, res, next) => {
        const params = publicQueryString(req.query);

        if(params instanceof Error)
            return res.APIError(params.message);

        const {by, order, page: {current, limit, skip}}  = params;

        if(!isPrivate(req)) {
            Articles.find({approved: true, public: true}, '-_id -approved -public -content -redactor -pinned -tags').sort({[by]: order}).skip(skip).limit(limit)
                .then(a => res.APISuccess(200, a))
                .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
        } else {
            const approved = ['true', 'false'].includes(req.query.approved)
                ? {approved: JSON.parse(req.query.approved)}
                : null;
            const _public = ['true', 'false'].includes(req.query.public)
                ? {public: JSON.parse(req.query.public)}
                : null;

            Articles.find({...approved, ..._public}, '-_id -content').sort(order).skip(skip).limit(limit)
                .then(a => res.APISuccess(200, a))
                .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
        };
    });

router.route('/:category')
    .get(authenfication, (req, res, next) => {
        const {category} = req.params;
        const params = publicQueryString(req.query);

        if(params instanceof Error)
            return res.APIError(params.message);

        Categories.findOne({slug: category})
            .then(c => {
                if(!c)
                    return res.APIError('NON_EXISTENT_CATEGORY');

                const {by, order, page: {current, limit, skip}}  = params;

                if(!isPrivate(req))
                    Articles.find({category, approved: true, public: true}, '-_id -approved -public -content -redactor -pinned -tags').sort({[by]: order}).skip(skip).limit(limit)
                        .then(a => res.APISuccess(200, a))
                        .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
                else
                    res.send("Récupération des articles de la catégorie, API Privée. " + category);
            })
            .catch(err => res.APIError('INTERNAL_SERVER_ERROR'))
    })

router.route('/:category/:title')
    .get(authenfication, (req, res, next) => {
        const {category, title} = req.params;

        Categories.findOne({slug: category})
            .then(c => {
                if(!c)
                    return res.APIError('NON_EXISTENT_CATEGORY');

                Articles.findOne({slug: title, category, approved: true, public: true}, '-_id -approved -public')
                    .then(a => {
                        if(!a)
                            return res.APIError('NON_EXISTENT_ARTICLE');

                        res.APISuccess(200, a);
                    })
                    .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
            })
            .catch(err => res.APIError('INTERNAL_SERVER_ERROR'))
    })

export default router;