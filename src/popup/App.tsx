import { useState, useMemo } from 'react';
import { useTabs } from '../hooks/useTabs';
import { useSelection } from '../hooks/useSelection';
import { Header } from '../components/Header';
import { TabList } from '../components/TabList';
import { FormatSelector } from '../components/FormatSelector';
import { ActionButton } from '../components/ActionButton';
import type { CopyFormat } from '../utils/format';
import { formatTabs } from '../utils/format';
import { copyToClipboard } from '../utils/clipboard';
import './App.css';

function App() {
  const { tabs, loading, error } = useTabs();
  const { selectedIds, toggle, selectAll, deselectAll } = useSelection();
  const [format, setFormat] = useState<CopyFormat>('text');
  const [copyStatus, setCopyStatus] = useState(false);

  const isAllSelected = useMemo(() => {
    return tabs.length > 0 && selectedIds.size === tabs.length;
  }, [tabs.length, selectedIds.size]);

  const handleSelectAll = () => {
    const allIds = tabs.map((t) => t.id);
    if (isAllSelected) {
      deselectAll(allIds);
    } else {
      selectAll(allIds);
    }
  };

  const handleCopy = async () => {
    if (selectedIds.size === 0) return;

    // Preserve order from tabs list
    const selectedTabs = tabs.filter((t) => selectedIds.has(t.id));
    const text = formatTabs(selectedTabs, format);
    await copyToClipboard(text);

    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  if (loading) {
    return <div className="loading">Loading tabs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <Header
        totalTabs={tabs.length}
        isChecked={isAllSelected}
        onSelectAll={handleSelectAll}
      />
      <TabList
        tabs={tabs}
        selectedIds={selectedIds}
        onToggle={toggle}
      />
      <FormatSelector format={format} onChange={setFormat} />
      <ActionButton
        label="Copy"
        count={selectedIds.size}
        onClick={handleCopy}
        disabled={selectedIds.size === 0}
        success={copyStatus}
      />
    </div>
  );
}

export default App;
