import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import TaskCard from './TaskCard.tsx';
import { Task, TaskStatus } from '../service/taskService';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onDeleteTask: (taskId: number | string, status: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  color,
  tasks,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  const statusColors: Record<TaskStatus, string> = {
    TODO: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    IN_PROGRESS: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    COMPLETED: 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    CANCELLED: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <Card className={`${color} border-2 ${isOver ? 'border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-700'} h-fit flex flex-col transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary" className={statusColors[status]}>
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 px-6 pb-6">
        <div
          ref={setNodeRef}
          className={`space-y-3 min-h-96 p-2 rounded-md border-2 border-dashed transition-all ${
            isOver 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' 
              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          data-status={status}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  status={status}
                  onDelete={() => onDeleteTask(task.id, status)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  No tasks in this column
                </p>
              </div>
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
