import { TableHead } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  title: string;
  selectOptions?: string[];
  onChange: (val: string) => void;
  defaultFilterState: string;
};
export default function StatementHeaderFilters({
  title,
  selectOptions,
  onChange,
  defaultFilterState,
}: Props) {
  return (
    <TableHead>
      <div className="flex flex-col items-center">
        <div className="text-center mb-3 font-semibolda">{title}</div>
        {title !== "Amount" ? (
          <Select defaultValue={defaultFilterState} onValueChange={onChange}>
            <SelectTrigger className="mb-3 mx-6 w-36 text-center">
              <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {selectOptions?.map((option: string, index: number) => {
                if (option === undefined) {
                  return undefined;
                } else {
                  return (
                    <SelectItem value={option} key={index}>
                      {option}
                    </SelectItem>
                  );
                }
              })}
            </SelectContent>
          </Select>
        ) : null}
      </div>
    </TableHead>
  );
}
