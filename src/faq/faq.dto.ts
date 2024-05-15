export interface QuestionBodyDTO {
    id?: number;
    questionText?: string;
    approve?: number;
}


export interface AnswerBodyDTO {
    id?: number;
    questionID?: number;
    answerText?: string;
    rating?: number[];
    approve?: number;
}

export interface FAQBodyDTO {
    limit: number;
    offset: number;
}

export interface FAQListBodyDTO {
    limit: number;
    offset: number;
    userID?: number;
    text?: string;
    approve?: number;
}