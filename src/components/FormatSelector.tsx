import type { CopyFormat } from '../utils/format';
import styles from './FormatSelector.module.css';

interface FormatSelectorProps {
    format: CopyFormat;
    onChange: (format: CopyFormat) => void;
}

export function FormatSelector({ format, onChange }: FormatSelectorProps) {
    const options: { value: CopyFormat; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'markdown', label: 'Markdown' },
        { value: 'html', label: 'HTML' },
    ];

    return (
        <div className={styles.container}>
            <span className={styles.label}>Format:</span>
            <div className={styles.options}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`${styles.option} ${format === option.value ? styles.active : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
