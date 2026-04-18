import { useEffect, useRef } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    onSelectAll: () => void;
    isChecked: boolean;
    totalTabs: number;
    filterText: string;
    onFilterChange: (text: string) => void;
}

export function Header({ onSelectAll, isChecked, totalTabs, filterText, onFilterChange }: HeaderProps) {
    const filterRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // autoFocus is unreliable when the popup is opened via keyboard shortcut
        // because the OS-level window focus hasn't transferred yet at that point.
        // Calling window.focus() first ensures the popup window has focus before
        // we focus the input element.
        window.focus();
        filterRef.current?.focus();
    }, []);

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
                ref={filterRef}
                type="text"
                className={styles.filterInput}
                placeholder="Filter by title or URL..."
                value={filterText}
                onChange={(e) => onFilterChange(e.target.value)}
            />
        </div>
    );
}
