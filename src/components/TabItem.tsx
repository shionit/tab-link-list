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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(tab.id);
                }
            }}
        >
            <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(tab.id)}
                onClick={(e) => e.stopPropagation()}
                className={styles.checkbox}
                tabIndex={-1}
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
