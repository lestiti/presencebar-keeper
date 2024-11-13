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
      <SelectTrigger className="w-[200px] bg-white border-gray-200">
        <SelectValue placeholder="Sélectionner une fonction" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="all" className="cursor-pointer hover:bg-gray-100">Toutes les fonctions</SelectItem>
        {functions?.map((func) => (
          <SelectItem 
            key={func} 
            value={func}
            className="cursor-pointer hover:bg-gray-100"
          >
            {func}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FunctionSelector;