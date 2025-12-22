/**
 * Game Hooks - Specialized hooks for game logic
 *
 * These hooks are extracted from useGameFlow to improve:
 * - Testability (each hook can be tested in isolation)
 * - Maintainability (single responsibility)
 * - Reusability (hooks can be used independently)
 */

export { useGameTimer } from './useGameTimer'
export { useGameCard } from './useGameCard'
export { useGamePopups } from './useGamePopups'
export { useGameHistory } from './useGameHistory'
export { useGameTurn } from './useGameTurn'
