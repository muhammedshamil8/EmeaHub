import ResourceCard from './ResourceCard';
import { StaggerContainer, StaggerItem } from '../common/MotionContainer';

export default function ResourceGrid({ resources }) {
    if (!resources || resources.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No resources found
                </p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">
                    Try adjusting your filters or search query
                </p>
            </div>
        );
    }

    return (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <StaggerItem key={resource.id}>
                    <ResourceCard resource={resource} />
                </StaggerItem>
            ))}
        </StaggerContainer>
    );
}