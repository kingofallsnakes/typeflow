import { supabase } from "@/lib/supabaseClient";
import { exportSnapshot, importSnapshot, type PlayerSnapshot } from "@/core/storage/localStore";

interface RemoteRow {
  game: unknown;
  lessons: unknown;
  quests: unknown;
  shop: unknown;
  placement: unknown;
  profile: unknown;
  sessions: unknown;
}

const asRecord = <T,>(value: unknown, fallback: T): T =>
  value && typeof value === "object" ? (value as T) : fallback;

/** Pull cloud progress and keep whichever save has more XP. */
export async function syncDown(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("player_state")
    .select("game, lessons, quests, shop, placement, profile, sessions")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    await syncUp(userId);
    return;
  }

  const row = data as unknown as RemoteRow;
  const local = exportSnapshot();
  const remoteGame = asRecord<{ xp?: number }>(row.game, {});
  const remoteXp = typeof remoteGame.xp === "number" ? remoteGame.xp : -1;

  if (remoteXp >= local.game.xp && remoteXp >= 0) {
    importSnapshot({
      game: row.game as PlayerSnapshot["game"],
      lessons: asRecord(row.lessons, {}) as PlayerSnapshot["lessons"],
      quests: row.quests as PlayerSnapshot["quests"],
      shop: asRecord(row.shop, {}) as PlayerSnapshot["shop"],
      placement: asRecord(row.placement, {}) as PlayerSnapshot["placement"],
      profile: row.profile as PlayerSnapshot["profile"],
      sessions: Array.isArray(row.sessions) ? (row.sessions as PlayerSnapshot["sessions"]) : [],
    });
  } else {
    await syncUp(userId);
  }
}

/** Push the local save to the cloud. */
export async function syncUp(userId: string): Promise<void> {
  const snapshot = exportSnapshot();
  await supabase.from("player_state").upsert(
    {
      user_id: userId,
      game: snapshot.game,
      lessons: snapshot.lessons,
      quests: snapshot.quests,
      shop: snapshot.shop,
      placement: snapshot.placement,
      profile: snapshot.profile,
      sessions: snapshot.sessions,
    } as never,
    { onConflict: "user_id" },
  );
}
