export interface UserBodyDTO {
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    phoneVerify?: boolean;
    email?: string;
    password?: string;
    oldPassword?: string;
    emailVerify?: boolean;
    avatar?: string | null;
    status?: number;
}

export interface UserListBodyDTO {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    status?: number;
    limit: number;
    offset: number;
}