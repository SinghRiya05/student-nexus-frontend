import { z } from "zod";
export const profileSchema = z.object({
    // General
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(7, "Invalid phone"),
    interestBadge: z.string().optional(), // Optional
    profession: z.string().min(1, "Required"),
    // Educational
    universityName: z.string().min(1, "Required"),
    courseName: z.string().min(1, "Required"),
    currentSemester: z.string().min(1, "Required"),
    batchName: z.string().optional(), // Optional
    completionYear: z.string().optional(), // Optional
    admissionDate: z.string().optional(), // Optional
    // Other
    country: z.string().optional(), // Optional
    state: z.string().optional(), // Optional
    city: z.string().optional(), // Optional
    pinCode: z.string().optional(), // Optional
});

export type ProfileValues = z.infer<typeof profileSchema>;