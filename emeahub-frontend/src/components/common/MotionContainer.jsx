import { motion } from "motion/react";

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export const FadeIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerContainer = ({ children, className = "" }) => (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, className = "" }) => (
    <motion.div variants={itemVariants} className={className}>
        {children}
    </motion.div>
);
