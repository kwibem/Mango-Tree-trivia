import { validateAnswerWithLLM } from './llmService';
import { isFuzzyMatch } from '../utils/stringUtils';

// Mock the fuzzy match utility
jest.mock('../utils/stringUtils');

// Mock the global fetch
global.fetch = jest.fn();

describe('validateAnswerWithLLM', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when Ollama responds with YES', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ response: 'YES' }),
        });

        const result = await validateAnswerWithLLM('Question', 'Correct', 'User');
        expect(result).toBe(true);
        expect(isFuzzyMatch).not.toHaveBeenCalled();
    });

    it('should return false when Ollama responds with NO', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ response: 'NO' }),
        });

        const result = await validateAnswerWithLLM('Question', 'Correct', 'User');
        expect(result).toBe(false);
        expect(isFuzzyMatch).not.toHaveBeenCalled();
    });

    it('should fall back to fuzzy match when fetch fails (network error)', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
        (isFuzzyMatch as jest.Mock).mockReturnValue(true);

        const result = await validateAnswerWithLLM('Question', 'Correct', 'User');

        expect(result).toBe(true);
        expect(isFuzzyMatch).toHaveBeenCalledWith('User', 'Correct');
    });

    it('should fall back to fuzzy match when response is not ok', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            statusText: 'Internal Server Error',
        });
        (isFuzzyMatch as jest.Mock).mockReturnValue(false);

        const result = await validateAnswerWithLLM('Question', 'Correct', 'User');

        expect(result).toBe(false);
        expect(isFuzzyMatch).toHaveBeenCalledWith('User', 'Correct');
    });

    it('should sanitize input by removing XML tags', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ response: 'YES' }),
        });

        await validateAnswerWithLLM('Question', 'Correct', '<script>alert("xss")</script>User');

        // Check the prompt sent to fetch to verify sanitization
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);

        expect(body.prompt).toContain('<user_answer>alert("xss")User</user_answer>');
        expect(body.prompt).not.toContain('<script>');
    });

    it('should truncate long inputs', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ response: 'YES' }),
        });

        const longInput = 'a'.repeat(150);
        await validateAnswerWithLLM('Question', 'Correct', longInput);

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);

        // Should be truncated to 100 chars
        const match = body.prompt.match(/<user_answer>(.*?)<\/user_answer>/);
        expect(match[1].length).toBe(100);
    });
});
