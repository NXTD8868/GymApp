import * as z from "zod"
const workoutObject = z.object({
    sessionName: z.string().min(1),
    startedAt: z.coerce.date(),
    endedAt: z.coerce.date(),
    exercises: z.array(z.object({
        exerciseKey: z.string(),
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

type DraftSet = { weight: string; reps: string }       
type DraftExercise = { exercise: Exercise; sets: DraftSet[] }
export type {DraftExercise,DraftSet}
export const workoutDocument = workoutObject.extend({
    _id :z.string(),
    userId: z.string()
})
type WorkoutDocument = z.infer<typeof workoutDocument>
export type {WorkoutDocument}
