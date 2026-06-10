const getApiBaseUrl = () => (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

/**
 * Convert backend image paths to a fully qualified URL.
 * - If the value is already absolute (http/https), return as-is.
 * - If it's a backend relative path like /uploads/xxx.jpg, prepend API base url.
 * - If it doesn't start with /uploads, still try to prepend base url safely.
 */
export const toUploadsUrl = (value) => {
    if (!value) return value;

    if (typeof value !== 'string') return value;

    const str = value.trim();
    if (!str) return str;

    if (str.startsWith('http://') || str.startsWith('https://')) return str;

    const API_URL = getApiBaseUrl();

    // normalize slashes
    if (str.startsWith('/')) {
        return `${API_URL}${str}`;
    }

    return `${API_URL}/${str}`;
};

export const toUploadsUrlArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(toUploadsUrl);
};

