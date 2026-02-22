import type { Tab } from '../hooks/useTabs';
import { TabItem } from './TabItem';
import styles from './TabList.module.css';

interface TabListProps {
    tabs: Tab[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
}

export function TabList({ tabs, selectedIds, onToggle }: TabListProps) {
    return (
        <div className={styles.tabList}>
            {tabs.map((tab) => (
                <TabItem
                    key={tab.id}
                    tab={tab}
                    selected={selectedIds.has(tab.id)}
                    onToggle={onToggle}
                />
            ))}
        </div>
    );
}
