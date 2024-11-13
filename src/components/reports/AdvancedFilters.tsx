import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, SlidersHorizontal } from "lucide-react";

interface AdvancedFiltersProps {
  onFilterChange: (filters: {
    synode?: string;
    function?: string;
    minDuration?: number;
    maxDuration?: number;
    searchTerm?: string;
  }) => void;
}

const AdvancedFilters = ({ onFilterChange }: AdvancedFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    synode: "",
    function: "",
    minDuration: 0,
    maxDuration: 0,
    searchTerm: "",
  });

  const handleFilterChange = (key: string, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center gap-2"
      >
        {showFilters ? <Filter className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
        {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
      </Button>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg border animate-fade-in">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recherche</label>
            <Input
              placeholder="Rechercher..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Synode</label>
            <Select
              value={filters.synode}
              onValueChange={(value) => handleFilterChange("synode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un synode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les synodes</SelectItem>
                <SelectItem value="synode-a">Synode A</SelectItem>
                <SelectItem value="synode-b">Synode B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fonction</label>
            <Select
              value={filters.function}
              onValueChange={(value) => handleFilterChange("function", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une fonction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les fonctions</SelectItem>
                <SelectItem value="mpiomana">Mpiomana</SelectItem>
                <SelectItem value="mpiandry">Mpiandry</SelectItem>
                <SelectItem value="mpampianatra">Mpampianatra</SelectItem>
                <SelectItem value="iraka">Iraka</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Durée minimum (heures)</label>
            <Input
              type="number"
              min="0"
              value={filters.minDuration}
              onChange={(e) => handleFilterChange("minDuration", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Durée maximum (heures)</label>
            <Input
              type="number"
              min="0"
              value={filters.maxDuration}
              onChange={(e) => handleFilterChange("maxDuration", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;