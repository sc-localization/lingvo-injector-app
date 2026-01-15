import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

type Option<T> = {
  id: T;
  name: string;
  code?: string; // not used here
};
type SelectProps<T extends string> = {
  labelKey: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

const Select = observer(
  <T extends string>({
    labelKey,
    options,
    value,
    onChange,
  }: SelectProps<T>) => {
    const { t } = useTranslation();

    return (
      <div>
        <label htmlFor={labelKey}>{t(labelKey)}</label>

        <select
          name={labelKey}
          id={value}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value as T)}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default Select;
