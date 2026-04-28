"use client";
import { useState, useTransition } from "react";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "./card";
import UpdatePasswordDialog from "./dialogs/update-password-dialog";
import { updateName } from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./input";
import { ClientLoader } from "./client-loader";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};
export default function AccountsCard({ user }: { user: User }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const updateNameHandler = () => {
    startTransition(async () => {
      try {
        const result = await updateName(name);
        console.log(name);

        if (!result.success) {
          throw new Error(result.message);
        }

        if (result.success) {
          router.refresh();
          toast.success(result.message);
          setIsEditingName(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }

        return;
      }
    });
  };

  const handleCardAction = async () => {
    if (isEditingName) {
      updateNameHandler();
    } else {
      setIsEditingName(true);
    }
  };
  return (
    <>
      <UpdatePasswordDialog
        isOpen={passwordDialogOpen}
        closeDialog={setPasswordDialogOpen}
      />
      <Card className="relative">
        <ClientLoader show={isPending} />
        <CardHeader>
          <CardTitle className="text-xl">Account Information</CardTitle>
          <CardAction>
            <Button
              className="cursor-pointer mx-1"
              variant="default"
              onClick={handleCardAction}
            >
              {isEditingName ? "Save" : "Edit Name"}
            </Button>
            {isEditingName ? (
              <Button
                className="cursor-pointer mx-1"
                variant="outline"
                onClick={() => setIsEditingName(false)}
              >
                Cancel
              </Button>
            ) : null}
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="m-3">
            <div className="text-sm opacity-75">Full Name:</div>
            {isEditingName ? (
              <Input
                className="mt-1 w-1/3"
                defaultValue={user.name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <div>{user.name}</div>
            )}
          </div>
          <div className="m-3">
            <div className="text-sm opacity-75">Email:</div>
            <div>{user.email}</div>
          </div>
          <div className="m-3">
            {!isEditingName && (
              <Button
                className="cursor-pointer"
                variant="default"
                onClick={() => setPasswordDialogOpen(true)}
              >
                Edit Password
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
