import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneField = () => {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      international
      defaultCountry='UA' // Код страны (Украина)
      value={phone}
      onChange={setPhone}
      placeholder='Введите номер телефона'
    />
  );
};

export default PhoneField;
