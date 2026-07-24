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
    return res.status(201).json({ res: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save workout' });
  }
});
router.get('/history', async (req: Request, res: Response) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' });
  const { year, month,limit } = req.query 
  const filter: any = { userId }
  if (year && month) {
    const y = Number(year)
    const m = Number(month)                    
    const start = new Date(Date.UTC(y, m - 1, 1))      
    const end   = new Date(Date.UTC(y, m, 1))           
    filter.startedAt = { $gte: start, $lt: end }
  }
  let query = workouts.find(filter).sort({ startedAt: -1 })
  if (limit) query = query.limit(Number(limit))

  const workoutHistory = await workouts.find(filter).sort({ startedAt: -1 }).toArray()
  return res.status(200).json({res:workoutHistory})
 });

router.get('/exercises', async (req: Request, res: Response) => { 
  try {
    const exercisesCatalog = await exercises.find({}).toArray()
    return res.status(200).json({res:exercisesCatalog})
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Can not fetch exercises' });
  }
});
export default router;