export function formValidator(
  signUp: boolean,
  email: string,
  password: string,
  confirmPassword?: string,
  name?: string
) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordsMatch = password === confirmPassword;
  if (!email) errors.push("Email is required");

  if (email && !emailRegex.test(email)) errors.push("Email is invalid");

  if (email && email.length > 254) errors.push("Email is too long");

  if (!signUp && !password) errors.push("Password is required");

  if (signUp && (!password || !confirmPassword))
    errors.push("Passwords are required");

  if (signUp && password && confirmPassword && !passwordsMatch)
    errors.push("Passwords are not matching");

  if (signUp && passwordsMatch) {
    if (password.length < 8)
      errors.push("Password must be at least 8 characters");

    if (!/[A-Z]/.test(password))
      errors.push("Password must include an uppercase letter");

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (password.length > 16) {
      errors.push("Password is too long");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
  }

  if (signUp && !name) errors.push("Name is required");

  if (signUp && name && name.length > 254) errors.push("Name is too long");

  return errors;
}
