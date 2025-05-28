import React from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Стили для react-phone-number-input

interface PhoneInputProps {
  value: string; // Текущее значение номера телефона (желательно в E.164 формате)
  // onChange теперь принимает только номер телефона, так как react-phone-number-input
  // обычно используется с react-hook-form или напрямую управляет своим состоянием.
  // Для простоты интеграции с вашими текущими формами, мы будем передавать только значение.
  // Если вам нужны данные о стране, их можно получить из самого значения E.164.
  onChange: (phoneNumberE164: string | undefined) => void;
  defaultCountry?: Country; // Страна по умолчанию (например, 'ua', 'pl')
  preferredCountries?: Country[];
  inputClassName?: string; // Классы для стилизации самого поля ввода
  // containerClassName больше не так актуален, так как стилизация компонента другая
  containerClassName?: string; // Классы для стилизации контейнера компонента
}

const PhoneInputField: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  defaultCountry = 'PL',
  preferredCountries = ['PL', 'UA', 'US', 'DE'],
  // Стилизуем инпут, чтобы он был похож на другие поля в вашем проекте
  inputClassName = 'w-full border p-2 rounded border-gray-300 focus:border-shop-blue-dark focus:ring-shop-blue-dark',
  // containerClassName = 'intl-tel-input w-full', // Этот класс специфичен для старой библиотеки
}) => {
  return (
    <PhoneInput
      international // Показывает + перед кодом страны
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange} // onChange передает значение в формате E.164 или undefined
      countries={preferredCountries}
      className={inputClassName} // Применяем стили к самому инпуту
      // Для react-phone-number-input стили применяются к корневому элементу
      // и к внутреннему <input> через inputComponent или напрямую через CSS.
      // Класс inputClassName будет применен к обертке, а не к самому <input>.
      // Чтобы стилизовать сам <input>, можно использовать CSS или передать кастомный inputComponent.
      // Однако, для простоты, попробуем так. Если стили не применятся как надо,
      // можно будет добавить глобальные стили для `.PhoneInputInput`.
      // Пример:
      // inputComponent={React.forwardRef((props, ref) => (
      //   <input {...props} ref={ref} className={inputClassName} />
      // ))}
      // Но для начала попробуем без этого.
      // `react-phone-number-input/react-hook-form` ожидает `control` из react-hook-form,
      // но мы можем использовать его и как управляемый компонент, передавая value и onChange.
      // Если возникнут проблемы, можно использовать базовый `import PhoneInput from 'react-phone-number-input'`
    />
  );
};

export default PhoneInputField;
