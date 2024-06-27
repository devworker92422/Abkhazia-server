export interface NewQuestionBodyDTO {
    ownewrName: string;
    ownerAvatar?: string;
    questionText: string;
}

export interface UpdateQuestionBodyDTO {
    ownewrName?: string;
    ownerAvatar?: string;
    questionText?: string;
    approve?: number;
    active?: boolean;

}

export interface ListAllEntities {
    limit: number,
    offset: number
}

export interface NewAnswerBodyDTO {
    ownerName: string;
    ownerAvatar?: string;
    answerText: string;
    questionID: number;
}

export interface UpdateAnswerBodyDTO {
    ownerName?: string;
    ownerAvatar?: string;
    answerText?: string;
    isRight?: boolean;
    rating?: number;
}