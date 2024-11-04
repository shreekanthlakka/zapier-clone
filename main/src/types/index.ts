import { z } from "zod";

const SignUpSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20),
});

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
});

const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(
        z.object({
            availableActionId: z.string(),
            actionMetadata: z.any().optional(),
        })
    ),
});

export { SignUpSchema, SignInSchema, ZapCreateSchema };
