import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeSelectorProps) => {
  return (
    <div className="flex gap-4">
      <Card className="p-4">
        <p className="text-sm text-gray-500 mb-2">Date de début</p>
        <Calendar
          mode="single"
          selected={startDate}
          onSelect={(date) => date && onStartDateChange(date)}
          className="rounded-md border"
          locale={fr}
        />
      </Card>

      <Card className="p-4">
        <p className="text-sm text-gray-500 mb-2">Date de fin</p>
        <Calendar
          mode="single"
          selected={endDate}
          onSelect={(date) => date && onEndDateChange(date)}
          className="rounded-md border"
          locale={fr}
        />
      </Card>
    </div>
  );
};

export default DateRangeSelector;