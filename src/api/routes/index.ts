import authMiddleware from '@middlewares/auth/authMiddleware';

import { Router } from 'express';

const mainRouter = () => {
  const router = Router();

  router.use(authMiddleware);

  return router;
};

export default mainRouter;
