import * as z from "zod"
const workoutObject = z.object({
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

type Workout = z.infer<typeof workoutObject>

export {workoutObject}
export type {Workout}

export const exerciseobject = z.object({
    key: z.string(),
    exerciseName: z.string(),
    muscleGroup: z.string()
})

type Exercise = z.infer<typeof exerciseobject>
export type {Exercise}