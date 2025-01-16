import * as z from "zod";

export const LoginSchema = z.object({
  userIdentity: z
    .string({
      message: "Enter your username or email or phone number",
    })
    .nonempty({ message: "Input field cannot be empty" }),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .nonempty({ message: "Password field cannot be empty" }),
  code: z.optional(z.string()),
});

export const SignupSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  name: z.string().min(1, {
    message: "name is required",
  }),
  termsAndCondition: z.boolean({
    message: "Terms and Condition has to be agreed to access the application",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const PersonalInfoFormSchema = z.object({
  gender: z.string({ message: "choose your gender" }).nonempty({
    message: "Gender cannot be empty.",
  }),
  city: z.string({ message: "Enter location" }).nonempty({
    message: "Location cannot be empty.",
  }),
  // .max(10, "Postal code cannot exceed 10 characters")
  // .regex(/^[a-zA-Z0-9\s\-]+$/, "Invalid postal code format"),
  firstname: z
    .string()
    .nonempty({
      message: "First name cannot be empty.",
    })
    .min(3, {
      message: "Invalid first name. It must be between 3 and 30 characters long.",
    })
    .max(30, {
      message: "Invalid first name. It must be between 3 and 30 characters long.",
    })
    .regex(/^[A-Za-z]+$/, {
      message: "First name can only contain alphabets.",
    }),
  lastname: z
    .string()
    .nonempty({
      message: "Last Name cannot be empty.",
    })
    .min(1, {
      message:  "Invalid Last name. It must be between 1 and 30 characters long.",
    })
    .max(30, {
      message:  "Invalid Last name. It must be between 1 and 30 characters long.",
    })
    .regex(/^[A-Za-z]+$/, {
      message: "Last name can only contain alphabets.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .nonempty({
      message: "Email cannot be empty.",
    })
    .email(),
  dob: z
    .date({
      required_error: "A date of birth is required.",
    })
    .refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > date.getMonth() ||
          (today.getMonth() === date.getMonth() &&
            today.getDate() >= date.getDate());
        return hasHadBirthdayThisYear ? age >= 18 : age > 18;
      },
      {
        message: "You must be at least 18 years old to use this application.",
      },
    ),

  mobile: z
    .string()
    .nonempty({
      message: "Mobile Number cannot be empty.",
    })
    .regex(/^(91[-\s]?)?[6-9]\d{9}$/, {
      message:
        "Must be a valid 10-digit number.",
    }),
});

export const PasswordFormSchema = z
  .object({
    password: z
      .string()
      .nonempty({
        message: "Password cannot be empty.",
      })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/\d/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one symbol.",
      }),
    userName: z
      .string()
      .nonempty({
        message: "User Name cannot be empty.",
      })
      .min(3, { message: "Username must be at least 3 characters." })
      .max(30, { message: "Username must not be longer than 30 characters." })
      .regex(/^(?![._-])(?!.*[._-]{2})[a-zA-Z0-9._-]+$/, {
        message:
          "Username can only contain letters, numbers, underscores, dots, and hyphens.\n It cannot start with special characters or \nhave consecutive special characters.",
      }),

    TnC: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to proceed.",
    }),
    TnC2: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to proceed.",
    }),
    confirmPassword: z.string().nonempty({
      message: "Confirm Password cannot be empty.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"], // Attach the error to `confirmPassword`
  });

export const OTPFormSchema = z.object({
  verifyEmail: z
    .string()
    .nonempty({
      message: "Email OTP cannot be empty.",
    })
    .regex(/^\d{6}$/, {
      message: "Your one-time password must be exactly 6 digits.",
    })
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .max(6),
  verifyMobileNumber: z
    .string()
    .nonempty({
      message: "Mobile OTP cannot be empty.",
    })
    .regex(/^\d{6}$/, {
      message: "Your one-time password must be exactly 6 digits.",
    })
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .max(6),
});


export const EditPersonalInfoFormSchema = z.object({
  gender: z.string({ message: "choose your gender" }).nonempty({
    message: "Gender cannot be empty.",
  }),
  // city: z.string({ message: "Enter location" }).nonempty({
  //   message: "Location cannot be empty.",
  // }),
  // .max(10, "Postal code cannot exceed 10 characters")
  // .regex(/^[a-zA-Z0-9\s\-]+$/, "Invalid postal code format"),
  firstname: z
    .string()
    .nonempty({
      message: "First name cannot be empty.",
    })
    .min(3, {
      message: "Invalid first name. It must be between 3 and 30 characters long.",
    })
    .max(30, {
      message: "Invalid first name. It must be between 3 and 30 characters long.",
    })
    .regex(/^[A-Za-z]+$/, {
      message: "First name can only contain alphabets.",
    }),
  lastname: z
    .string()
    .nonempty({
      message: "Last Name cannot be empty.",
    })
    .min(1, {
      message:  "Invalid Last name. It must be between 1 and 30 characters long.",
    })
    .max(30, {
      message:  "Invalid Last name. It must be between 1 and 30 characters long.",
    })
    .regex(/^[A-Za-z]+$/, {
      message: "Last name can only contain alphabets.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .nonempty({
      message: "Email cannot be empty.",
    })
    .email(),
  dob: z
    .date({
      required_error: "A date of birth is required.",
    })
    .refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > date.getMonth() ||
          (today.getMonth() === date.getMonth() &&
            today.getDate() >= date.getDate());
        return hasHadBirthdayThisYear ? age >= 18 : age > 18;
      },
      {
        message: "You must be at least 18 years old to use this application.",
      },
    ),

  mobile: z
    .string()
    .nonempty({
      message: "Mobile Number cannot be empty.",
    })
    .regex(/^(91[-\s]?)?[6-9]\d{9}$/, {
      message:
        "Must be a valid 10-digit number.",
    }),
    title:z.string().optional(),
    desc:z.string().optional()
});

export const combinedSchema = z.object({
  ...PersonalInfoFormSchema.shape,
  ...OTPFormSchema.shape,
  ...PasswordFormSchema.safeParse,
});
