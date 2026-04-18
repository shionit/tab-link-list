import { useState, useMemo, useEffect } from 'react';
import { useTabs } from '../hooks/useTabs';
import { useSelection } from '../hooks/useSelection';
import { Header } from '../components/Header';
import { TabList } from '../components/TabList';
import { BottomBar } from '../components/BottomBar';
import type { CopyFormat } from '../utils/format';
import { formatTabs } from '../utils/format';
import { filterTabs } from '../utils/filter';
import { copyToClipboard } from '../utils/clipboard';
import './App.css';

function App() {
  const { tabs, activeTabId, loading, error } = useTabs();
  const { selectedIds, toggle, selectAll, deselectAll, setSelection } = useSelection();
  const [format, setFormat] = useState<CopyFormat>('text');
  const [filterText, setFilterText] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);

  const filteredTabs = useMemo(
    () => filterTabs(tabs, filterText),
    [tabs, filterText]
  );

  // Pre-select the current (active) tab once tabs have loaded
  useEffect(() => {
    if (activeTabId !== null) {
      setSelection([activeTabId]);
    }
  }, [activeTabId, setSelection]);

  // Deselect tabs hidden by filter
  useEffect(() => {
    const visibleIds = new Set(filteredTabs.map((t) => t.id));
    const hiddenIds = tabs.filter((t) => !visibleIds.has(t.id)).map((t) => t.id);
    deselectAll(hiddenIds);
  }, [filteredTabs, tabs, deselectAll]);

  const isAllSelected = useMemo(() => {
    return filteredTabs.length > 0 && filteredTabs.every((t) => selectedIds.has(t.id));
  }, [filteredTabs, selectedIds]);

  const handleSelectAll = () => {
    const ids = filteredTabs.map((t) => t.id);
    if (isAllSelected) {
      deselectAll(ids);
    } else {
      selectAll(ids);
    }
  };

  const handleCopy = async () => {
    if (selectedIds.size === 0) return;

    // Preserve order from tabs list
    const selectedTabs = filteredTabs.filter((t) => selectedIds.has(t.id));
    const text = formatTabs(selectedTabs, format);
    await copyToClipboard(text);

    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  // Ctrl+Enter from anywhere triggers copy
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleCopy();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, filteredTabs, format]);

  if (loading) {
    return <div className="loading">Loading tabs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <Header
        totalTabs={filteredTabs.length}
        isChecked={isAllSelected}
        onSelectAll={handleSelectAll}
        filterText={filterText}
        onFilterChange={setFilterText}
      />
      <TabList
        tabs={filteredTabs}
        selectedIds={selectedIds}
        onToggle={toggle}
      />
      <BottomBar
        format={format}
        onFormatChange={setFormat}
        count={selectedIds.size}
        onCopy={handleCopy}
        disabled={selectedIds.size === 0}
        success={copyStatus}
      />
    </div>
  );
}

export default App;
