export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateEnrollmentNo = (enrollment) => {
    const re = /^[A-Z0-9]+$/i;
    return re.test(enrollment) && enrollment.length >= 5;
};

export const validateFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeMB) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};