export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const truncateText = (text, length = 100) => {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
};

export const getBadgeFromPoints = (points) => {
    if (points >= 5000) return 'Platinum';
    if (points >= 1000) return 'Gold';
    if (points >= 500) return 'Silver';
    if (points >= 100) return 'Bronze';
    return 'Newbie';
};

export const getBadgeColor = (badge) => {
    const colors = {
        Platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        Gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Silver: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        Bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        Newbie: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[badge] || colors.Newbie;
};