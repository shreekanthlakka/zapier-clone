import { User } from "@prisma/client";

export const omitFields = (user: User, fields: string[]): Partial<User> => {
    const result = { ...user };
    fields.forEach((field) => {
        delete result[field as keyof User];
    });
    return result;
};
