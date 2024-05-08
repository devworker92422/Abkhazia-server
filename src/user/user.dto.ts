export interface UserBodyDTO {
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    phoneVerify?: boolean;
    email?: string;
    password?: string;
    emailVerify?: boolean;
    avatar?: string | null;
    status?: number;
}