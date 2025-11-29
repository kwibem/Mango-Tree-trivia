/**
 * Calculates the Levenshtein distance between two strings.
 * This represents the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one word into the other.
 */
export const getLevenshteinDistance = (a: string, b: string): number => {
    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

/**
 * Determines if two strings are a fuzzy match based on Levenshtein distance.
 * The allowed distance depends on the length of the correct answer.
 */
export const isFuzzyMatch = (userAnswer: string, correctAnswer: string): boolean => {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();

    if (normalizedUser === normalizedCorrect) return true;

    const distance = getLevenshteinDistance(normalizedUser, normalizedCorrect);
    const length = normalizedCorrect.length;

    // Threshold logic:
    // Length <= 3: Exact match required (distance 0)
    // Length 4-6: Allow 1 edit
    // Length > 6: Allow 2 edits
    if (length <= 3) {
        return distance === 0;
    } else if (length <= 6) {
        return distance <= 1;
    } else {
        return distance <= 2;
    }
};
