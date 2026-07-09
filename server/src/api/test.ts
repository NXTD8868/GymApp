import express, { type Request, type Response, type NextFunction } from 'express';

const router = express.Router();

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now());
  next();
};
router.use(timeLog);

// define the home page route
router.get('/', (req: Request, res: Response) => {
  res.send('Birds home page');
});
// define the about route
router.get('/about', (req: Request, res: Response) => {
  res.send('About birds');
});

export default router;