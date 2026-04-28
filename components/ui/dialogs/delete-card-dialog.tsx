import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
  bankName: string;
  statementDate: string;
  dueDate: string;
  onConfirmDelete: () => void;
};
export default function DeleteCardDialog({
  isOpen,
  closeDialog,
  bankName,
  statementDate,
  dueDate,
  onConfirmDelete,
}: Props) {
  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={closeDialog}>
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this credit card?
          </DialogDescription>
        </DialogHeader>
        <div className="container mb-10">
          <div className="mb-2">
            <strong>{bankName}</strong>
          </div>
          <div>
            Statement billing date:
            <strong>{statementDate} of the month</strong>
          </div>
          <div>
            Statement due date: <strong>{dueDate} of the month</strong>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onConfirmDelete}>Confirm Delete</Button>
          <Button variant="secondary" onClick={closeDialog}>
            Nevermind
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
