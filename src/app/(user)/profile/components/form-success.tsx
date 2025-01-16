import { MdDone } from "react-icons/md";

interface FormErrorProps {
  message?: string;
}

export default function FormSuccess({ message }: FormErrorProps) {
  return (
    <div className="bg-emerald-400/15 p-3 rounded flex gap-x-2 text-sm items-center text-emerald-700">
      <MdDone className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
