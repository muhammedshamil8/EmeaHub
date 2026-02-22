import ResourceCard from './ResourceCard';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
    );
}