import type { Tab } from '../hooks/useTabs';
import styles from './TabItem.module.css';

interface TabItemProps {
    tab: Tab;
    selected: boolean;
    onToggle: (id: number) => void;
}

export function TabItem({ tab, selected, onToggle }: TabItemProps) {
    return (
        <div
            className={`${styles.tabItem} ${selected ? styles.selected : ''}`}
            onClick={() => onToggle(tab.id)}
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === ' ') {
                    e.preventDefault();
                    onToggle(tab.id);
                }
            }}
        >
            <input
                type="checkbox"
                checked={selected}
                onChange={() => {}}
                tabIndex={-1}
                aria-hidden="true"
                className={styles.checkbox}
            />
            {tab.favIconUrl && (
                <img src={tab.favIconUrl} alt="" className={styles.favicon} />
            )}
            <span className={styles.title} title={tab.title}>
                {tab.title}
            </span>
        </div>
    );
}
