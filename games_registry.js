import { CountingGame } from './game_counting.js';
import { CompareGame } from './game_compare.js';
import { AdditionGame } from './game_addition.js';
import { SubtractionGame } from './game_subtraction.js';
import { MissingGame } from './game_missing.js';
import { PatternGame } from './game_patterns.js';
import { ShadowGame } from './game_shadow.js';
import { ShapesGame } from './game_shapes.js';
import { SortingGame } from './game_sorting.js';
import { MeasureGame } from './game_measure.js'; // NEW

export const GAMES = [
    CountingGame,
    ShapesGame,
    ShadowGame,
    SortingGame,
    { ...CompareGame, requires: { game: 'counting', level: 3 } },
    { ...MeasureGame, requires: { game: 'counting', level: 4 } }, // NEW: Unlocks after counting
    { ...PatternGame, requires: { game: 'compare', level: 3 } },
    { ...AdditionGame, requires: { game: 'measure', level: 3 } },
    { ...MissingGame, requires: { game: 'addition', level: 2 } },
    { ...SubtractionGame, requires: { game: 'addition', level: 4 } }
];