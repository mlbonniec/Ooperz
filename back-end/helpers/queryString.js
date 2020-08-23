/**
 * Processes the allowed query string parameters.
 * @param {object} query - Query String object of request
 * @returns {object} {by, order, page} that will have to be desctructured 
 */
export const publicQueryString = (query) => {
    const by = query.by ? query.by.toLowerCase() : 'date';
    const order = query.order ? query.order.toLowerCase() : 'desc';
    const page = (() => {
        if(!query.page)
            return {limit: 30, skip: 0};
            
        const p = parseInt(query.page, 10);
        if(Number.isInteger(p) && p > 0)
            return {limit: 30, skip: 30 * (p - 1)};
        
        return new Error('WRONG_PARAMETERS');
    })()

    const byParameters = ['date', 'views'];
    const orderParameters = ['asc', 'desc'];

    if((by && !byParameters.includes(by)) || (order && !orderParameters.includes(order)) || page instanceof Error)
        return new Error('WRONG_PARAMETERS');

    return {by, order, page};
};