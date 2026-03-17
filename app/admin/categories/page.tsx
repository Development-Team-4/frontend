import { TopicList } from '@/widgets/topic-list';
import { TopicsCategoriesSettings } from '@/widgets/topics-categories-settings';

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <TopicsCategoriesSettings />
      <TopicList />
    </div>
  );
}
