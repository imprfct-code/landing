import { capDuel } from "./cap-duel";
import type { GameLegalConfig } from "./types";

/**
 * Register each published or tested game here.
 * Adding an entry automatically generates:
 *   - /<slug>/privacy
 *   - /<slug>/delete
 *   - /<slug>/terms
 */
export const GAMES: readonly GameLegalConfig[] = [capDuel];

export function getGameBySlug(slug: string): GameLegalConfig | undefined {
  return GAMES.find((game) => game.slug === slug);
}
