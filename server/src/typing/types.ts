import * as z from "zod"
import { ObjectId } from "mongodb";
const workoutInputSchema = z.object({
    startedAt: z.coerce.date(),
    endedAt: z.coerce.date(),
    exercises: z.array(z.object({
        exerciseId: z.string(),
        sets: z.array(z.object({
            weight: z.number().positive(),
            reps: z.number().positive()
        })).min(1)
    })).min(1)
})

type WorkoutInput = z.infer<typeof workoutInputSchema>
export type WorkoutDocument = WorkoutInput & {
  _id?: ObjectId;
  userId: string;
};
export {workoutInputSchema}
export type {WorkoutInput}

export const ExerciseSchema = z.object({
    key: z.string(),
    exerciseName: z.string(),
    muscleGroup: z.string()
})

type Exercise = z.infer<typeof ExerciseSchema>
export type {Exercise}