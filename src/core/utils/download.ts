/**
 * Downloads a blob via a temporary link, fetched through axios so the interceptor still adds X-Tenant and the session.
 */
export function saveBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
}
