import { isFuzzyMatch } from "../utils/stringUtils";

/**
 * Validates the user's answer using an LLM (simulated).
 * 
 * In a real implementation, this would call an API (e.g., OpenAI) to ask:
 * "Is '{userAnswer}' a correct answer for the question '{question}'? The known correct answer is '{correctAnswer}'."
 * 
 * For now, this simulates a network delay and uses the fuzzy match logic.
 */
export const validateAnswerWithLLM = async (
    question: string,
    correctAnswer: string,
    userAnswer: string
): Promise<boolean> => {
    const prompt = `You are a similarity-matching engine for evaluating quiz answers.
                    Your task is to determine whether the user's answer matches the correct answer
                    for the given question. Consider meaning, intent, and context.

                    Rules:
                    - Accept minor misspellings, grammar errors, synonyms, or paraphrasing.
                    - Accept answers that are contextually correct based on the question.
                    - Do NOT accept answers that change the meaning.
                    - Respond with exactly ONE word: YES or NO.

                    Question: "${question}"
                    Correct answer: "${correctAnswer}"
                    User answer: "${userAnswer}"

                    Return only YES or NO.`;

    try {
        const apiUrl = process.env.REACT_APP_OLLAMA_API_URL || "http://localhost:11434/api/generate";
        const model = process.env.REACT_APP_OLLAMA_MODEL || "llama3";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        const reply = data.response?.trim().toUpperCase() || "";

        return reply.includes("YES");

    } catch (error) {
        console.warn("Ollama validation failed, falling back to fuzzy match:", error);
        // Fallback to fuzzy match if Ollama fails (e.g., not running, CORS error)
        return isFuzzyMatch(userAnswer, correctAnswer);
    }
};
