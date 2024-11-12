import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FunctionSelectorProps {
  selectedFunction: string;
  functions: string[] | undefined;
  onFunctionChange: (value: string) => void;
}

const FunctionSelector = ({ selectedFunction, functions, onFunctionChange }: FunctionSelectorProps) => {
  return (
    <Select value={selectedFunction} onValueChange={onFunctionChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sélectionner une fonction" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Toutes les fonctions</SelectItem>
        {functions?.map((func) => (
          <SelectItem key={func} value={func}>
            {func}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FunctionSelector;