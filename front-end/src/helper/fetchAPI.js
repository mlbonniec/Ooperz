import axios from 'axios';
import querystring from 'querystring';

// fetchAPI('/v1/articles', {
//     headers: {
//         'Authorization': `Bearer ${process.env.TOKEN_API}`
//     },
//     queryString: {
//         by: 'views',
//         order: 'desc'
//     }
// });

/**
 * Fetch the API
 * @param {string} path path of the query
 * @param {object} options Query options
 * @param {object} options.params Object containing query string parameters
 * @param {object} options.headers Object containing query headers
 * @param {"GET" | "POST" | "PUT" | "DELETE"} options.method Query method
 * @returns {object} The result of the request parsed
 */
export default async (path, options = {}) => {
    const params = options.params || {};
    const headers = options.headers || {};
    const method = options.method || "GET";

    return new Promise(async (resolve, reject) => {
        return axios({
            url: process.env.BASE_URL + path,
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN_API}`,
                ...headers
            },
            params,
            method
        })
        .then(res => resolve(res))
        .catch(err => reject(err.response ? err.response.status : 500));
    });
};