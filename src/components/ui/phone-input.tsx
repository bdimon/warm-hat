import React, { useEffect, useState } from 'react';
import {
  AsYouType,
  parsePhoneNumberFromString,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js';

interface PhoneInputProps {
  value: string | undefined; // E.164 value preferred
  onChange: (phoneNumberE164: string | undefined) => void;
  defaultCountry?: CountryCode; // e.g. 'PL', 'UA'
  preferredCountries?: CountryCode[];
  inputClassName?: string;
}

const PhoneInputField: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  defaultCountry = 'PL',
  preferredCountries = ['PL', 'UA', 'US', 'DE'],
  inputClassName = 'w-full border p-2 rounded border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark',
}) => {
  const [display, setDisplay] = useState<string>(() => {
    if (!value) return '';
    try {
      const parsed = parsePhoneNumberFromString(value);
      return parsed ? parsed.formatInternational() : value;
    } catch {
      return value;
    }
  });
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);

  // keep local display in sync when external value changes
  useEffect(() => {
    if (!value) return setDisplay('');
    try {
      const parsed = parsePhoneNumberFromString(value);
      setDisplay(parsed ? parsed.formatInternational() : value);
      if (parsed && parsed.country) setSelectedCountry(parsed.country);
    } catch {
      setDisplay(value);
    }
  }, [value]);

  const handleChange = (raw: string) => {
    // format as user types using AsYouType for the default country
    try {
      const formatter = new AsYouType(selectedCountry);
      const formatted = formatter.input(raw);
      setDisplay(formatted);

      // attempt to parse to E.164 and pass that to onChange when possible
      const parsed = parsePhoneNumberFromString(formatted, selectedCountry);
      if (parsed && parsed.isValid()) {
        onChange(parsed.number);
      } else {
        // if not valid yet, pass undefined so validators can handle empty/invalid
        onChange(undefined);
      }
    } catch (e) {
      setDisplay(raw);
      onChange(undefined);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <select
        aria-label='Select country'
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
        className='border rounded p-2 bg-white'
      >
        {preferredCountries.map((c) => (
          <option key={c} value={c}>
            {c} (+{getCountryCallingCode(c)})
          </option>
        ))}
      </select>
      <input
        type='tel'
        className={inputClassName}
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={undefined}
      />
    </div>
  );
};

export default PhoneInputField;
