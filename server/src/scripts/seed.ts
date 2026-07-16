import { MongoClient } from "mongodb";
import { z } from "zod";
import { ExerciseSchema, type Exercise } from "../typing/types.ts";
import { exercises,client } from '../lib/db.ts';
const exerciseData: Exercise[] = [
  { key: "barbell-bench-press", exerciseName: "Barbell Bench Press", muscleGroup: "Chest" },
  { key: "incline-dumbbell-press", exerciseName: "Incline Dumbbell Press", muscleGroup: "Chest" },
  { key: "pull-up", exerciseName: "Pull-Up", muscleGroup: "Back" },
  { key: "barbell-row", exerciseName: "Barbell Row", muscleGroup: "Back" },
  { key: "deadlift", exerciseName: "Deadlift", muscleGroup: "Back" },
  { key: "overhead-press", exerciseName: "Overhead Press", muscleGroup: "Shoulders" },
  { key: "lateral-raise", exerciseName: "Lateral Raise", muscleGroup: "Shoulders" },
  { key: "barbell-squat", exerciseName: "Barbell Squat", muscleGroup: "Legs" },
  { key: "leg-press", exerciseName: "Leg Press", muscleGroup: "Legs" },
  { key: "romanian-deadlift", exerciseName: "Romanian Deadlift", muscleGroup: "Legs" },
  { key: "bicep-curl", exerciseName: "Bicep Curl", muscleGroup: "Arms" },
  { key: "tricep-pushdown", exerciseName: "Tricep Pushdown", muscleGroup: "Arms" },
];

async function seed(): Promise<void> {

  const validated = z.array(ExerciseSchema).parse(exerciseData);


  try {
    await exercises.createIndex({ key: 1 }, { unique: true });
    const result = await exercises.bulkWrite(
      validated.map((exercise) => ({
        updateOne: {
          filter: { key: exercise.key },
          update: { $set: exercise },
          upsert: true,
        },
      }))
    );

    console.log(
      `Seed complete → inserted: ${result.upsertedCount}, ` +
        `updated: ${result.modifiedCount}, total in list: ${validated.length}`
    );
  } finally {
    // Always close the connection, even if something above throws.
    await client.close()
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});