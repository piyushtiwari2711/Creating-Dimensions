const z = require("zod");

const signupType = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Minimum 6 characters required"),
  fullName: z.string().min(1, "Full Name is required").max(64),
});

const signinType = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Minimum 6 characters required"),
});

module.exports = {
  signinType,
  signupType,
};
