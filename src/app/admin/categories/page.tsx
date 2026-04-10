import { TopicList } from '@/widgets/categories/topic-list';
import { TopicsCategoriesSettings } from '@/widgets/categories/topics-categories-settings';

export default function CategoriesPage() {
  return (
    <div className="px-3 py-3 sm:p-4 lg:p-6">
      <TopicsCategoriesSettings />
      <TopicList />
    </div>
  );
}
