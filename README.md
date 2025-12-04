# Mango Tree Trivia

Mango Tree Trivia is an interactive React-based trivia application that leverages local Large Language Models (LLMs) to intelligently validate user answers. Unlike traditional trivia games that require exact string matches, Mango Tree Trivia understands context, synonyms, and minor typos, providing a smoother and more enjoyable player experience.

## Features

- **AI-Powered Validation**: Uses [Ollama](https://ollama.com/) to run a local LLM for checking answers, allowing for natural language understanding.
- **Smart Fallback**: Automatically switches to fuzzy string matching if the local LLM is unavailable.
- **Timed Gameplay**: Challenge yourself with a countdown timer for each question.
- **Score Tracking**: Keep track of your correct answers throughout the session.
- **Responsive Design**: Built with React and modern CSS for a clean user interface.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** (usually comes with Node.js)
- **[Ollama](https://ollama.com/)** (Required for AI answer validation)

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Mango-Tree-trivia
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file to create your local configuration.
    ```bash
    cp .env.example .env
    ```
    
    Open `.env` and adjust the settings if necessary:
    - `REACT_APP_TIMER_DURATION`: Time in seconds for each question (default: 20).
    - `REACT_APP_OLLAMA_API_URL`: URL for your local Ollama instance (default: `http://localhost:11434/api/generate`).
    - `REACT_APP_OLLAMA_MODEL`: The LLM model to use (default: `qwen2.5:3b`).

## Running the Application

### 1. Start Ollama (AI Service)

To enable intelligent answer validation, you need to have Ollama running with the specified model.

First, pull the model defined in your `.env` (e.g., `qwen2.5:3b`):
```bash
ollama pull qwen2.5:3b
```

Then, start the Ollama server:
```bash
ollama serve
```
*Note: If you skip this step, the game will fallback to basic fuzzy string matching.*

### 2. Start the React App

In a new terminal window, run:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode.
- **`npm test`**: Launches the test runner.
- **`npm run build`**: Builds the app for production to the `build` folder.

## Technologies Used

- React 19
- TypeScript
- React Router
- Ollama (Local LLM Integration)
