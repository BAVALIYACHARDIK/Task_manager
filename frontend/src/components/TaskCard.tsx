import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Task, TaskStatus, getPriorityColor, getStatusColor, formatTaskDate } from '../service/taskService';
import { Trash2, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  status: TaskStatus;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, status, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'rotate-6 shadow-2xl opacity-50' : 'hover:shadow-md'
      }`}
    >
      <div className="space-y-3">
        {/* Drag Handle + Delete Button */}
        <div className="flex items-start justify-between gap-2">
          <div {...attributes} {...listeners} className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <GripVertical size={16} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {/* Task Title */}
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-gray-100">
            {task.title}
          </h3>
        </div>

        {/* Task Description */}
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {/* Priority Badge */}
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
              {task.tags.length} tag{task.tags.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Due: {formatTaskDate(task.dueDate)}
          </div>
        )}

        {/* Status Badge at bottom */}
        <Badge variant="secondary" className={getStatusColor(task.status)}>
          {task.status.replace('_', ' ')}
        </Badge>
      </div>
    </Card>
  );
};

export default TaskCard;
