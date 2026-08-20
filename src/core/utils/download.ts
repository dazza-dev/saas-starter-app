/**
 * Descarga un blob mediante un enlace temporal. Los archivos se piden por axios
 * para que el interceptor añada X-Tenant y la sesión.
 */
export function saveBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
}
