import styles from './Header.module.css';

interface HeaderProps {
    onSelectAll: () => void;
    isChecked: boolean;
    totalTabs: number;
    filterText: string;
    onFilterChange: (text: string) => void;
}

export function Header({ onSelectAll, isChecked, totalTabs, filterText, onFilterChange }: HeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.topRow}>
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
            <input
                type="text"
                className={styles.filterInput}
                placeholder="Filter by title or URL..."
                value={filterText}
                onChange={(e) => onFilterChange(e.target.value)}
            />
        </div>
    );
}
