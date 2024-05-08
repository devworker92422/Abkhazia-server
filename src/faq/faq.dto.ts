export interface QuestionBodyDTO {
    id?: number;
    questionText?: string;
    approve?: boolean;
}


export interface AnswerBodyDTO {
    id?: number;
    questionID?: number;
    answerText?: string;
    rating?: number[];
    approve?: boolean;
}

export interface FAQBodyDTO {
    limit: number;
    offset: number;
}