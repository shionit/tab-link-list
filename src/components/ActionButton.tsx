import styles from './ActionButton.module.css';

interface ActionButtonProps {
    label: string;
    count: number;
    onClick: () => void;
    disabled?: boolean;
    success?: boolean;
}

export function ActionButton({ label, count, onClick, disabled, success }: ActionButtonProps) {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.button} ${success ? styles.success : ''}`}
                onClick={onClick}
                disabled={disabled}
            >
                {success ? 'Copied!' : `${label} (${count})`}
            </button>
        </div>
    );
}
