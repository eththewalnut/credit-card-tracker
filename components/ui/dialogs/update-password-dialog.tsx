import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updatePassword } from "@/lib/actions/auth-actions";
import { toast } from "sonner";

function passwordValidator(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  const errors = [];
  const passwordsMatch = newPassword === confirmPassword;
  if (!oldPassword || !newPassword || !confirmPassword) {
    errors.push("Please fill all fields.");
  }
  if (!passwordsMatch) {
    errors.push("Passwords should be matching.");
  }
  if (passwordsMatch) {
    if (newPassword.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(newPassword)) {
      errors.push("Password must include an uppercase letter");
    }

    if (!/\d/.test(newPassword)) {
      errors.push("Password must contain at least one number");
    }

    if (newPassword.length > 16) {
      errors.push("Password is too long");
    }
  }

  return errors;
}

export default function UpdatePasswordDialog({
  isOpen,
  closeDialog,
}: {
  isOpen: boolean;
  closeDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [viewPasswords, setViewPasswords] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const hasErrors = passwordValidator(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    if (hasErrors.length > 0) {
      setError(hasErrors);
      setIsLoading(false);
      return;
    }
    try {
      const result = await updatePassword(newPassword, currentPassword);
      if (!result) {
        throw new Error("Something went wrong");
      }
      if (!result.success) {
        if (result.message === "Invalid password") {
          throw new Error("Incorrect current password!");
        } else {
          throw result;
        }
      }

      if (result.success) {
        toast("Password successfully updated!");
      }

      toast.success("Password successfully updated!");
    } catch (err) {
      const e = err as Error;
      setError((prev) => [...prev, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={() => closeDialog(false)}>
        <DialogHeader>
          <DialogTitle>Update your password</DialogTitle>
          <DialogDescription>
            Please fill in the following fields to proceed updating your
            password.
          </DialogDescription>
          {error.length > 0 && (
            <div className="bg-yellow-400 text-sm text-black p-2 my-2">
              {error.map((err, index) => (
                <p key={index}>{err}</p>
              ))}
            </div>
          )}
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="current-password">
                    Current Password:
                  </FieldLabel>
                  <Input
                    id="current-password"
                    type={viewPasswords ? "text" : "password"}
                    required
                    onChange={(e) => {
                      setError([]);
                      setCurrentPassword(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                  <FieldLabel htmlFor="new-password">New Password:</FieldLabel>
                  <Input
                    id="new-password"
                    type={viewPasswords ? "text" : "password"}
                    required
                    onChange={(e) => {
                      setError([]);
                      setNewPassword(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                  <FieldLabel htmlFor="new-password">
                    Confirm Password:
                  </FieldLabel>
                  <Input
                    id="new-password"
                    type={viewPasswords ? "text" : "password"}
                    required
                    onChange={(e) => {
                      setError([]);
                      setConfirmPassword(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                </Field>
                <Field orientation="horizontal">
                  <Button
                    type="button"
                    variant="link"
                    className="cursor-pointer p-0"
                    onClick={() => setViewPasswords((prev) => !prev)}
                  >
                    {viewPasswords ? "Hide passwords" : "Show passwords?"}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading || error.length > 0}
              >
                Submit
              </Button>
              <Button
                disabled={isLoading}
                variant="outline"
                type="button"
                onClick={() => {
                  closeDialog(false);
                  setError([]);
                }}
              >
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
