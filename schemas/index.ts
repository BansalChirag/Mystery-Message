import * as z from 'zod'

// export const usernameValidation = z.string().min(3,'Username must be at least 3 characters')
// .max(30,'Username must be no more than 30 characters')
// .regex(/^(?=[a-zA-Z_]+[a-zA-Z0-9_.]*)(?=[a-zA-Z0-9_]+)[a-zA-Z0-9_\.]{3,30}(?<!\.)(?!\.{2,})$/, 'Username must not contain special characters')

// ^(?![0-9]+$)(?!.*\.\.)(?=[a-zA-Z0-9._]{3,30}$)(?!^\.)[a-zA-Z0-9._]*(?<!\.)$

export const usernameValidation = z.string()
.min(1,'Username is required.')
 .min(3, 'Username must be at least 3 characters')
 .max(30, 'Username must be no more than 30 characters')
 .refine((val) => /[a-zA-Z]/.test(val), 'Username must contain at least one letter or underscore')
 .refine((val) => /^[a-zA-Z0-9_\.]+$/.test(val), 'Username can only contain letters, numbers, dots, or underscores')
 .refine((val) =>!/\.{2,}/.test(val), 'Username cannot contain consecutive dots')
 .refine((val) =>!/^\./.test(val) &&!/\.$/.test(val), 'Username cannot start or end with a dot');


export const signupSchema = z.object({
    username:usernameValidation,
    email: z.string()
    .min(1,"Email is required")
    .email({
        message:"Invalid Email"
    }),
    password: z.string().min(1,"Password is required.").min(6, {message: "Password must be at least 6 characters"})
})

export const signInSchema = z.object({
    identifier: z.string().min(1,"This field is required"),
    password: z.string().min(1,"Password is required.")
})

export const forgotPasswordSchema = z.object({
    email: z.string().min(1,"Email is required").email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(1,"New Password is required.").min(6, {message: "Password must be at least 6 characters"}),
    confirmNewPassword: z.string().min(1,"Confirm New Password is required.")
}).
superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Confirm New Password must match the New Password",
        path: ['confirmNewPassword']
      });
    }
})
// refine((data)=>data.newPassword!==data.confirmNewPassword,{
//     message:"Confirm New Password must match the password",
//     path:['confirmNewPassword']
// })

export const messageSchema = z.object({
    content: z.string().min(1,"message is required.")
    .max(300, { message: 'Content must not be longer than 300 characters.' }),
})

