import express, { type Request, type Response, type NextFunction } from 'express';
import z from 'zod'
import { type WorkoutInput, workoutInputSchema } from '../typing/types.ts';
import { requireAuth } from '../middleware/requireAuth.ts';
import { workouts,exercises } from '../lib/db.ts';
const router = express.Router();
router.use(requireAuth)
router.get('/ok', (req: Request, res: Response) => {
  res.send('ok');
});
router.post('/', async (req: Request, res: Response) => {
  const parsed = workoutInputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors:z.treeifyError(parsed.error) })
  }
  try {
    const result = await workouts.insertOne({
      userId: req.user!.id,   
      ...parsed.data,       
    });

    return res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save workout' });
  }
});

router.get('/exercises', async (req: Request, res: Response) => {
  const exercisesCatalog = await exercises.find({}).toArray()
  console.log(exercises)
  res.json({a:'sasss',res:exercisesCatalog})
});
export default router;