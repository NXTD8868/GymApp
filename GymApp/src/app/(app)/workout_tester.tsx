import { colors, fonts, radius, spacing } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type SetInput = { weight: string; reps: string };
type ExerciseInput = { exerciseId: string; sets: SetInput[] };

export default function WorkoutTester() {
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { exerciseId: "", sets: [{ weight: "", reps: "" }] },
  ]);
  const [response, setResponse] = useState("");

  // --- mutations ---
  const addExercise = () =>
    setExercises([...exercises, { exerciseId: "", sets: [{ weight: "", reps: "" }] }]);

  const addSet = (exIndex: number) => {
    const copy = [...exercises];
    copy[exIndex].sets.push({ weight: "", reps: "" });
    setExercises(copy);
  };

  const setExerciseId = (exIndex: number, value: string) => {
    const copy = [...exercises];
    copy[exIndex].exerciseId = value;
    setExercises(copy);
  };

  const setField = (exIndex: number, setIndex: number, field: keyof SetInput, value: string) => {
    const copy = [...exercises];
    copy[exIndex].sets[setIndex][field] = value;
    setExercises(copy);
  };

  // --- send ---
  const onSend = async () => {
    const now = new Date();
    const body = {
      startedAt: now.toISOString(),
      endedAt: now.toISOString(),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map((s) => ({
          weight: Number(s.weight),
          reps: Number(s.reps),
        })),
      })),
    };

    setResponse("Sending...");
    try {
      const res = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authClient.$fetch ? {} : {}), // cookies handled by client below
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const text = await res.text();
      setResponse(`Status ${res.status}\n\n${text}`);
    } catch (e) {
      setResponse("Failed: " + String(e));
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 24, color: colors.text }}>
        Workout tester
      </Text>

      {exercises.map((ex, exIndex) => (
        <View key={exIndex} style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm }}>
          <TextInput
            value={ex.exerciseId}
            onChangeText={(v) => setExerciseId(exIndex, v)}
            placeholder="exerciseId"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            style={{ fontFamily: fonts.body, color: colors.text, backgroundColor: colors.surfaceRaised, borderRadius: radius.sm, padding: spacing.sm }}
          />

          {ex.sets.map((s, setIndex) => (
            <View key={setIndex} style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
              <TextInput
                value={s.weight}
                onChangeText={(v) => setField(exIndex, setIndex, "weight", v)}
                placeholder="weight"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={{ flex: 1, fontFamily: fonts.body, color: colors.text, backgroundColor: colors.surfaceRaised, borderRadius: radius.sm, padding: spacing.sm }}
              />
              <Text style={{ color: colors.textMuted }}>×</Text>
              <TextInput
                value={s.reps}
                onChangeText={(v) => setField(exIndex, setIndex, "reps", v)}
                placeholder="reps"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                style={{ flex: 1, fontFamily: fonts.body, color: colors.text, backgroundColor: colors.surfaceRaised, borderRadius: radius.sm, padding: spacing.sm }}
              />
            </View>
          ))}

          <Pressable onPress={() => addSet(exIndex)}>
            <Text style={{ color: colors.accent, fontFamily: fonts.bodyBold, fontSize: 13 }}>+ Add set</Text>
          </Pressable>
        </View>
      ))}

      <Pressable onPress={addExercise}>
        <Text style={{ color: colors.accent, fontFamily: fonts.bodyBold }}>+ Add exercise</Text>
      </Pressable>

      <Pressable onPress={onSend} style={{ backgroundColor: colors.accent, borderRadius: radius.md, padding: spacing.md, alignItems: "center" }}>
        <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 18, color: colors.background }}>SEND TO API</Text>
      </Pressable>

      <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 12 }}>Response</Text>
      <Text style={{ fontFamily: "monospace", color: colors.textMuted, fontSize: 12 }}>{response || "—"}</Text>
    </ScrollView>
  );
}