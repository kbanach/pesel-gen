import { useEffect, useState } from "react";

interface BirthDateProps {
  onChange: (newDateISO: string) => void;
  value?: string;
}

export const BirthDate = ({ onChange, value }: BirthDateProps) => {
  const [date, setDate] = useState<string>(value || "1970-01-01");

  useEffect(() => {
    onChange(date);
  }, [date, onChange]);

  useEffect(() => {
    if (value && value !== date) setDate(value);
  }, [value]);

  return (
    <>
      <input
        title={"birth date"}
        type="date"
        value={date}
        onChange={(evt) => setDate(evt.target.value)}
      />
    </>
  );
};
