import {compareSync, hashSync} from 'bcrypt';
import apiToken from '../models/apiToken';
import redactors from '../models/redactors';

const getAuthorization = (req) => {
    const {authorization} = req.headers;

    if(!authorization)
        return new Error('NO_AUTHENTIFICATION_PROVIDED');

    const [type, value] = authorization.split(' ');
    
    // Si l'authentification n'est pas Bearer ou Basic
    if(type !== 'Bearer' && type !== 'Basic')
        return new Error('WRONG_AUTH_TYPE');

    return [type, value];
};

// Bearer authentification - Public API
export const publicAuth = (req, res, next) => {
    const authorization = getAuthorization(req);

    if(authorization instanceof Error)
        return res.APIError(authorization.message);

    const [type, value] = authorization;

    if(type !== 'Bearer')
        return res.APIError('WRONG_AUTH_TYPE');

    const host = req.headers.host;
    const ip = req.clientIp;

    if(!ip || !host)
        return res.APIError('WRONG_AUTH_TYPE');

    apiToken.findOne({token: value, domains: {$elemMatch: {domain: host, ip}}})
        .then(c => {
            if(!c)
                return res.APIError('BAD_AUTH_CREDENTIALS');

            next();
        })
        .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
};

// Basic authentification - Private API
export const privateAuth = (req, res, next) => {
    const authorization = getAuthorization(req);

    if(authorization instanceof Error)
        return res.APIError(authorization.message);

    const [type, value] = authorization;

    if(type !== 'Basic')
        return res.APIError('WRONG_AUTH_TYPE');

    const decoded = Buffer.from(value, 'base64').toString('ascii');
    const [email, password] = decoded.split(/:(.*)/);

    redactors.findOne({email})
        .then(r => {
            if(!r || !compareSync(password, r.password))
                return res.APIError('BAD_AUTH_CREDENTIALS');
            
            req.session.isPrivate = true;
            next();
        })
        .catch(err => res.APIError('INTERNAL_SERVER_ERROR'));
};

export default (req, res, next) => {
    const authorization = getAuthorization(req);

    if(authorization instanceof Error)
        return res.APIError(authorization.message);

    // On a une authentification, on continue
    const [type, value] = authorization;

    if(type === 'Bearer')
        publicAuth(req, res, next);
    else if(type === 'Basic')
        privateAuth(req, res, next);
};

export const isPrivate = (req) => {
    return req.session.isPrivate;
};