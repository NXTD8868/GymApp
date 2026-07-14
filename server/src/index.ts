import express, { type Express, type Request, type Response } from 'express';
import { auth } from './lib/auth.ts';
import { toNodeHandler } from 'better-auth/node';
import cors from "cors"; // Import the CORS middleware
import workouts from './api/workout.ts'

const app: Express = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:8081", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.all('/api/auth/{*any}',toNodeHandler(auth))  
app.use(express.json());
// test
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.use('/api/workouts',workouts)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});