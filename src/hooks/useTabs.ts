import { useState, useEffect } from 'react';

export interface Tab {
    id: number;
    title: string;
    url: string;
    favIconUrl?: string;
}

export function useTabs() {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTabs = async () => {
            try {
                // Check if running in Chrome Extension environment
                if (typeof chrome !== 'undefined' && chrome.tabs) {
                    const tabs = await chrome.tabs.query({ currentWindow: true });
                    const mappedTabs = tabs.map((tab: chrome.tabs.Tab) => ({
                        id: tab.id!,
                        title: tab.title || '',
                        url: tab.url || '',
                        favIconUrl: tab.favIconUrl,
                    })).filter((tab: Tab) => tab.id !== undefined);
                    setTabs(mappedTabs);
                } else {
                    // Mock data for development
                    console.warn('Chrome API not found, using mock data');
                    setTabs([
                        { id: 1, title: 'Google', url: 'https://google.com', favIconUrl: 'https://www.google.com/favicon.ico' },
                        { id: 2, title: 'GitHub', url: 'https://github.com', favIconUrl: 'https://github.com/favicon.ico' },
                        { id: 3, title: 'React', url: 'https://react.dev', favIconUrl: 'https://react.dev/favicon.ico' },
                    ]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchTabs();
    }, []);

    return { tabs, loading, error };
}
