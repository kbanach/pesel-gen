import { useEffect, useState } from "react";
import { BirthDate } from "./BirthDate";
import "./pesel.scss";

const getControlSum = (pesel10FirstDigits: string): number => {
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

  const sum = pesel10FirstDigits
    .split("")
    .map((digit: string, idx: number) => parseInt(digit) * weights[idx])
    .reduce((acc, weighted) => acc + weighted, 0);

  const modulo = sum % 10;

  if (modulo === 0) {
    return 0;
  }

  return 10 - modulo;
};

// dla osób urodzonych w innych latach niż 1900–1999 dodawane są do numeru miesiąca następujące wielkości:
// dla lat 1800–1899 – 80
// dla lat 2000–2099 – 20
// dla lat 2100–2199 – 40
// dla lat 2200–2299 – 60
const parsePeselBirthDate = (
  dateISO: string
): [Year: string, Month: string, Day: string] => {
  let [year, month, day] = dateISO
    .split("-")
    .map((digit) => parseInt(digit, 10));

  if (year < 1900) {
    month += 80;
  }

  if (year >= 2000 && year < 2100) {
    month += 20;
  }
  if (year >= 2100 && year < 2200) {
    month += 40;
  }

  if (year >= 2200) {
    month += 60;
  }

  return [
    String(year % 100).padStart(2, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ];
};

export const Pesel = () => {
  const [birthDateState, setBirthDateState] = useState<string>("1970-01-01");
  const [birthPart, setBirthPart] = useState<string>(birthDateState);

  useEffect(() => {
    const parsedBirthDate = parsePeselBirthDate(birthDateState).join("");
    console.log("parsedBirthDate: ", parsedBirthDate);
    if (/^\d{6}$/.test(parsedBirthDate)) {
      setBirthPart(parsedBirthDate);
    }
  }, [birthDateState]);

  const [serialNumberState, setSerialNumberState] = useState<string>("012");
  const [serialNumber, setSerialNumber] = useState<string>(serialNumberState);

  useEffect(() => {
    if (serialNumberState.length === 3) {
      setSerialNumber(serialNumberState);
    }
  }, [serialNumberState, serialNumber]);

  // cyfry 0, 2, 4, 6, 8 – oznaczają płeć żeńską
  //cyfry 1, 3, 5, 7, 9 – oznaczają płeć męską
  const [genderState, setGenderState] = useState<string>("3");
  const [genderNr, setGenderNr] = useState<string>("3");
  const [isMale, setIsMale] = useState<boolean>(false);

  useEffect(() => {
    const genderStateNr = parseInt(genderState, 10);

    if (genderStateNr >= 0 && genderStateNr < 10) {
      setGenderNr(genderState);
      setIsMale(genderStateNr % 2 === 1);
    }
  }, [genderState, genderNr]);

  const pesel10FirstDigits = `${birthPart}${serialNumber}${genderNr}`;

  const controlSum = getControlSum(pesel10FirstDigits);

  const validPesel = `${pesel10FirstDigits}${controlSum}`;

  return (
    <>
      <h1>{validPesel}</h1>
      <div className="inputContainer">
        <div className="inputContainer__element">
          <BirthDate
            value={birthDateState}
            onChange={(newDateISO) => {
              setBirthDateState(newDateISO);
            }}
          />
        </div>
        <div>
          <input
            title="serial number (3 digits)"
            type="string"
            value={serialNumberState}
            onChange={(evt) => setSerialNumberState(evt.target.value)}
            size={3}
            maxLength={3}
          />
        </div>
        <div>
          <input
            title="gender digit (0-9, odds numbers are male, even are female)"
            type="string"
            value={genderState}
            onChange={(evt) => setGenderState(evt.target.value)}
            size={1}
            maxLength={1}
          />
          <br />
          <sup>({isMale ? "M" : "F"})</sup>
        </div>
      </div>
    </>
  );
};
