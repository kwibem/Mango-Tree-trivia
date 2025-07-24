# Claude Context - Mango Tree Trivia

## Project Overview
React-based trivia game application with TypeScript. Features include:
- Multiple rounds of trivia questions
- Point tracking system
- Game grid with clickable cards
- Question modal with timer
- Navigation between game states

## Recent Work Completed

### UI/UX Improvements
- **Navbar Implementation**: Created sticky navbar with points aligned to the right, added box-shadow
- **Theme Update**: Applied consistent blue color scheme across all components
  - Navbar: Dark blue (`#1e3a8a`) background with white text
  - Layout: Light blue (`#dbeafe`) background
  - Buttons: Blue gradient (`#3b82f6` to `#2563eb`)
  - Game Cards: Blue theme with hover states

### Performance Optimizations (High Impact)
1. **Memoized Expensive Calculations**
   - `areAllCellsClicked` in Game component now uses `useMemo`
   - Prevents expensive `array.flat().every()` operations on every render

2. **React.memo Implementation**
   - Added to `PointTracker` component - prevents re-renders when points unchanged
   - Added to `GameCard` component - only re-renders when specific card props change

3. **Inline Styles Optimization**
   - Moved Navigation component inline styles to `Navigation.css`
   - Eliminated object recreation on every render

4. **Timer Hook Fix**
   - Fixed memory leaks and inefficient interval management
   - Used `useRef` and `useCallback` for stable dependencies
   - Fixed "Cannot update component while rendering" error with `setTimeout` deferral

## Project Structure
```
src/
├── components/
│   ├── navigation/
│   │   ├── index.tsx
│   │   └── Navigation.css
│   ├── pointTracker.tsx (memoized)
│   ├── GameCard/
│   │   ├── GameCard.tsx (memoized)
│   │   └── GameCard.css (blue theme)
│   ├── Button/
│   │   └── Button.css (blue theme)
│   ├── Layout/
│   │   ├── Layout.tsx
│   │   └── Layout.css (blue background)
│   └── [other components]
├── pages/
│   └── game/
│       ├── index.tsx (optimized)
│       └── Game.css
├── utils/
│   └── hooks/
│       └── useTimeCounter.tsx (fixed)
```

## Key Technical Details

### Component Performance
- **PointTracker**: Memoized to prevent unnecessary re-renders when points unchanged
- **GameCard**: Memoized to only re-render when specific card state changes
- **Game Component**: Uses `useMemo` for expensive `areAllCellsClicked` calculation

### State Management
- Game state includes: `showQuestionModal`, `monitorGridClick`, `question`, `points`, `pointTracker`, `round`
- Grid click tracking uses 2D boolean array to monitor clicked cards
- Timer uses `useRef` to maintain stable interval reference

### Styling Architecture
- Component-specific CSS files for maintainability
- Consistent blue color palette across all components
- Responsive design with sticky navigation

### Known Issues Resolved
- ✅ Timer component state update during render cycle
- ✅ Navbar horizontal scroll due to container padding
- ✅ Unnecessary re-renders in grid components
- ✅ Memory leaks in timer intervals

## Development Notes
- All optimizations focused on high-impact performance improvements
- Blue theme uses shades: `#1e3a8a`, `#3b82f6`, `#2563eb`, `#60a5fa`, `#dbeafe`
- Navigation positioning accounts for Layout component's 20px padding
- React.memo implementation prevents cascade re-renders during gameplay

## Future Optimization Opportunities
- Code splitting for different routes
- Virtual scrolling for larger game grids
- Bundle size optimization
- Remove unnecessary React imports (React 17+ JSX transform)