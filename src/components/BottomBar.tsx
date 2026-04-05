import type { CopyFormat } from '../utils/format';
import styles from './BottomBar.module.css';

interface BottomBarProps {
  format: CopyFormat;
  onFormatChange: (format: CopyFormat) => void;
  count: number;
  onCopy: () => void;
  disabled?: boolean;
  success?: boolean;
}

const FORMAT_OPTIONS: { value: CopyFormat; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
];

export function BottomBar({ format, onFormatChange, count, onCopy, disabled, success }: BottomBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {FORMAT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.option} ${format === option.value ? styles.active : ''}`}
            onClick={() => onFormatChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        className={`${styles.button} ${success ? styles.success : ''}`}
        onClick={onCopy}
        disabled={disabled}
      >
        {success ? 'Copied!' : `Copy (${count})`}
      </button>
    </div>
  );
}
