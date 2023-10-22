
export interface IQuestion  {
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface IData {
    category: string;
    questions: IQuestion[];
}