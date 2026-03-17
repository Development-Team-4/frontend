'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useTopicsList } from '@/features/topics-list/use-topics-list';
import { FolderTree } from 'lucide-react';
import { CategoryItem } from '../category-item';

export const TopicList = () => {
  const { topics, getCategoriesByTopicId } = useTopicsList();
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
                  topicCategories.map((category, index) => (
                    <CategoryItem key={index} category={category} />
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
