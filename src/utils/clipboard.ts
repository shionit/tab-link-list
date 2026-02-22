export async function copyToClipboard(text: string): Promise<void> {
    if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}
