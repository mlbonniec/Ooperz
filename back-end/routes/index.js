import {Router} from 'express';
import loadRoutes from '../helpers/loadRoutes';

const router = Router();
const routes = loadRoutes(__dirname);

router.get('/', (req, res, next) => res.send('Hello world - index'));
router.use(routes);

export default router;