import { z } from "zod";
export const profileSchema = z.object({
    // General
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().min(7, "Invalid phone"),
    hobby_badge: z.string().optional(),
    bio: z.string().optional(),

    // Academic
    universityId: z.string().optional(),
    courseId: z.string().optional(),
    semesterId: z.string().optional(),
    startYear: z.string().optional(),
    endYear: z.string().optional(),

    // Arrays
    skills: z.array(z.object({ name: z.string().optional() })),
    projects: z.array(z.object({
        title: z.string().optional(),
        role: z.string().optional(),
        date: z.string().optional(),
        description: z.string().optional(),
    })),

    // Teacher specific
    designation: z.string().optional(),
    department: z.string().optional(),

    // Alumni specific
    currentCompany: z.string().optional(),
    jobTitle: z.string().optional(),

    // Shared by Teacher/Alumni
    experienceYears: z.string().optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;