import styles from './Header.module.css';

interface HeaderProps {
    onSelectAll: () => void;
    isChecked: boolean;
    totalTabs: number;
}

export function Header({ onSelectAll, isChecked, totalTabs }: HeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.title}>TabLinkList ({totalTabs})</div>
            <label className={styles.selectAll}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={onSelectAll}
                    className={styles.checkbox}
                />
                Select All
            </label>
        </div>
    );
}
