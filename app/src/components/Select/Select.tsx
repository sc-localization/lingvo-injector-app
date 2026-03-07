import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import styles from './Select.module.scss';

type Option<T> = {
  id: T;
  name: string;
  code?: string;
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
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => o.id === value);

    const handleSelect = useCallback(
      (id: T) => {
        onChange(id);
        setIsOpen(false);
      },
      [onChange]
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className={styles.group}>
        <label className={styles.label}>{t(labelKey)}</label>
        <div className={styles.wrapper} ref={wrapperRef}>
          <button
            type="button"
            className={`${styles.select} ${isOpen ? styles.open : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.selectedText}>
              {selectedOption?.name ?? '---'}
            </span>
            <span className={styles.arrow}>{isOpen ? '\u25B2' : '\u25BC'}</span>
          </button>

          {isOpen && (
            <ul className={styles.dropdown} role="listbox">
              {options.map((option) => (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={option.id === value}
                  className={`${styles.option} ${option.id === value ? styles.active : ''}`}
                  onClick={() => handleSelect(option.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      handleSelect(option.id);
                  }}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

export default Select;
