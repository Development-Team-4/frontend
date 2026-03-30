import { TopicList } from '@/widgets/categories/topic-list';
import { TopicsCategoriesSettings } from '@/widgets/categories/topics-categories-settings';

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <TopicsCategoriesSettings />
      <TopicList />
    </div>
  );
}
