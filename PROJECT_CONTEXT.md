# Mango Tree Trivia — Project Context

## Overview
- Single-page trivia game built with React + TypeScript.
- Bootstrapped using Create React App (CRA), client-side routing via `react-router-dom` v6.
- Local, in-memory question bank grouped by category; three rounds of play.

## Tech Stack
- React 19, TypeScript, CRA scripts (`react-scripts` 5).
- Routing: `react-router-dom` v6.
- Testing scaffold: Testing Library + Jest (CRA default).
- Styling: Component-scoped CSS files.

## App Flow
- Home (`/`): Start button navigates to Game.
- Game (`/game`): Grid of categories and point cards.
  - Clicking a card opens a modal with a multiple-choice question.
  - Answers are shuffled client-side; select to score points.
  - A countdown timer closes the modal on timeout.
  - After all cards are answered, a button advances rounds.
  - Rounds progress 1 → 2 → 3; after round 3, navigate to Final.
- Final (`/final`): Simple completion screen.

## Scoring & Rounds
- Card value: `(rowIndex + 1) * round * 100`.
- Correct: add points; Incorrect: subtract points.
- Grid click state prevents re-answering the same card.

## Data Model
- `src/pages/game/data.ts`: In-memory categories and questions.
- `src/utils/interfaces/questionInterface.ts`:
  - `IQuestion`: `{ difficulty, question, correct_answer, incorrect_answers }`
  - `IData`: `{ category, questions: IQuestion[] }`

## Key Components
- `Layout`: Page shell and layout helpers.
- `Button`: Reusable button with variants.
- `GameGrid` → `GameCard`: Board rendering, per-card point display and click handling.
- `questionModal/QuestionModal`: Displays question, shuffles answers, updates points, closes on selection or timeout.
- `Timer`: Visual progress + remaining seconds; drives modal auto-close.
- `navigation`: Shows current round and points (`pointTracker`).

## Routing
- `src/App.tsx`: Sets routes for Home, Game, Final using `<Routes>` and `<Route>`.

## Styling
- CSS files per component (e.g., `GameGrid.css`, `GameCard.css`, `QuestionModal.css`, `Layout.css`, `Timer.css`).

## Configuration
- `REACT_APP_TIMER_DURATION` (seconds) controls countdown length; defaults to `10` if not set.
- CRA scripts: `npm start`, `npm test`, `npm run build`, `npm run eject`.

## Recent Change (Timer Cadence)
- File: `src/utils/hooks/useTimeCounter.tsx`
- Change: Interval updated from `500ms` to `1000ms` to ensure precise 1-second decrements aligned with `REACT_APP_TIMER_DURATION`.
- Result: Progress bar and seconds display now track real time accurately.

## Potential Enhancements
- Persist game state/score (e.g., `localStorage`).
- Fetch questions from an API and add difficulty-weighted scoring.
- Add accessibility improvements (focus management in modal, ARIA roles).
- Add a scoreboard/summary on the Final screen.

