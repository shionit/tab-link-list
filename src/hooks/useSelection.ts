import { useState, useCallback } from 'react';

export function useSelection(initialSelected: number[] = []) {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(initialSelected));

    const toggle = useCallback((id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const selectAll = useCallback((ids: number[]) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => next.add(id));
            return next;
        });
    }, []);

    const deselectAll = useCallback((ids: number[]) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => next.delete(id));
            return next;
        });
    }, []);

    const setSelection = useCallback((ids: number[]) => {
        setSelectedIds(new Set(ids));
    }, []);

    return { selectedIds, toggle, selectAll, deselectAll, setSelection };
}
