import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTopicsList } from '@/features/topics-list/use-topics-list';
import { getCategoriesByTopicId, getStaffForCategory } from '@/lib/mock-data';
import { Edit2, FolderTree, Trash2, Users } from 'lucide-react';

export const TopicList = () => {
  const { topics } = useTopicsList();
  return (
    <Accordion
      type="multiple"
      defaultValue={topics.map((t) => t.id)}
      className="w-full"
    >
      {topics.map((topic) => {
        const topicCategories = getCategoriesByTopicId(topic.id);
        return (
          <AccordionItem key={topic.id} value={topic.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <FolderTree className="h-4 w-4 text-primary" />
                <span className="font-medium">{topic.name}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {topicCategories.length} категорий
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-7 flex flex-col gap-2 pt-2">
                {topicCategories.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">
                    В этой теме пока нет категорий
                  </p>
                ) : (
                  topicCategories.map((category) => {
                    const staff = getStaffForCategory(category.id);
                    return (
                      <Card key={category.id} className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-card-foreground">
                                {category.name}
                              </span>
                            </div>
                            {category.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {category.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">
                                Сотрудники:{' '}
                                {staff.length > 0
                                  ? staff.map((s) => s.name).join(', ')
                                  : 'Не назначены'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
