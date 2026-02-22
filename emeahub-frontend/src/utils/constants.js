export const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
    PUBLIC: 'public'
};

export const RESOURCE_TYPES = {
    NOTE: 'note',
    PYQ: 'pyq',
    SYLLABUS: 'syllabus',
    TIMETABLE: 'timetable',
    OTHER: 'other'
};

export const RESOURCE_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected'
};

export const VISIBILITY = {
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
    FEATURED: 'featured'
};

export const DAYS_OF_WEEK = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const POINTS = {
    UPLOAD: 5,
    VERIFY: 10,
    RATE: 2,
    DOWNLOAD: 1,
    REPORT: 0
};

export const BADGES = {
    BRONZE: { name: 'Bronze', points: 100 },
    SILVER: { name: 'Silver', points: 500 },
    GOLD: { name: 'Gold', points: 1000 },
    PLATINUM: { name: 'Platinum', points: 5000 }
};