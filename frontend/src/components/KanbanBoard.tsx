import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import KanbanColumn from './KanbanColumn.tsx';
import TaskCard from './TaskCard.tsx';
import CreateTaskDialog from './CreateTaskDialog.tsx';
import {
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  Task,
  TaskStatus,
} from '../service/taskService';
import { getAuthToken, isAuthenticated } from '../service/authService';
import { Loader2, Plus } from 'lucide-react';

export type TasksGrouped = {
  [key in TaskStatus]: Task[];
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TasksGrouped>({
    TODO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    CANCELLED: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Map task statuses to column names for display
  const columnConfig: Record<TaskStatus, { title: string; color: string }> = {
    TODO: { title: 'New Task', color: 'bg-gray-50 dark:bg-gray-900' },
    IN_PROGRESS: {
      title: 'Assigned',
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    COMPLETED: { title: 'Reviewing', color: 'bg-purple-50 dark:bg-purple-900/20' },
    CANCELLED: { title: 'Done', color: 'bg-green-50 dark:bg-green-900/20' },
  };

  /**
   * Fetch all tasks on component mount
   */
  useEffect(() => {
    loadTasks();
  }, []);

  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    })
  );

  /**
   * Load tasks from backend
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setError('You must be logged in to view tasks');
        setLoading(false);
        return;
      }

      console.log('📋 Fetching tasks with token:', getAuthToken()?.substring(0, 20) + '...');
      const response = await getAllTasks();

      if (response.success && response.data) {
        // Group tasks by status
        const grouped: TasksGrouped = {
          TODO: [],
          IN_PROGRESS: [],
          COMPLETED: [],
          CANCELLED: [],
        };

        // Ensure response.data is an array before iterating
        const taskArray = Array.isArray(response.data) ? response.data : [];

        taskArray.forEach((task: Task) => {
          if (grouped[task.status]) {
            grouped[task.status].push(task);
          }
        });

        setTasks(grouped);
        console.log('✅ Tasks loaded successfully:', taskArray.length, 'tasks');
      } else {
        setError(response.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load tasks'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle drag end - update task status
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      console.log('⚠️ No drop target detected');
      return;
    }

    // Log all information about the drop
    console.log('🎯 Drop Event Details:', {
      activeId: active.id,
      activeData: active.data?.current,
      overId: over.id,
      overData: over.data?.current,
      overRect: over.rect,
    });

    // Get the active task
    const activeTask = tasks[Object.keys(tasks).find(key => 
      tasks[key as TaskStatus].some(t => t.id === active.id)
    ) as TaskStatus]?.find(t => t.id === active.id);

    if (!activeTask) {
      console.error('❌ Active task not found');
      return;
    }

    let newStatus: TaskStatus | null = null;
    
    // Case 1: Dropped directly on a column (by id matching one of the status keys)
    const statusKey = Object.keys(tasks).find(key => key === over.id);
    if (statusKey) {
      newStatus = statusKey as TaskStatus;
      console.log(`📍 Case 1 - Dropped on column ${statusKey}`);
    }
    
    // Case 2: Dropped on another task - find which column it's in
    if (!newStatus && over.data?.current?.type === 'Task') {
      // Find which column contains the over task
      const columnWithTask = Object.keys(tasks).find(key => 
        tasks[key as TaskStatus].some(t => t.id === over.id)
      ) as TaskStatus | undefined;
      
      if (columnWithTask) {
        newStatus = columnWithTask;
        console.log(`📍 Case 2 - Dropped on task (ID: ${over.id}) in column ${columnWithTask}`);
      }
    }

    // Case 3: Dropped on column via data.status
    if (!newStatus && over.data?.current?.status) {
      newStatus = over.data.current.status as TaskStatus;
      console.log(`📍 Case 3 - Dropped on column zone with status ${newStatus}`);
    }

    // Case 4: Dropped on the drop zone container (type === 'Column')
    if (!newStatus && over.data?.current?.type === 'Column') {
      newStatus = over.data.current.status as TaskStatus;
      console.log(`📍 Case 4 - Dropped on column container with status ${newStatus}`);
    }

    if (!newStatus) {
      console.log('⚠️ Could not determine target status');
      console.log('Available columns:', Object.keys(tasks));
      console.log('Over element info:', { id: over.id, data: over.data?.current });
      return;
    }

    if (activeTask.status === newStatus) {
      console.log(`ℹ️ Task ${activeTask.id} already in column ${newStatus}, skipping`);
      return;
    }

    // Log authentication status
    console.log('🔐 Auth Status:', {
      isAuthenticated: isAuthenticated(),
      hasToken: !!getAuthToken(),
      tokenLength: getAuthToken()?.length || 0,
    });

    // Update local state immediately for better UX
    const oldStatus = activeTask.status;
    setTasks((prev) => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter((t) => t.id !== activeTask.id),
      [newStatus!]: [
        ...prev[newStatus!],
        { ...activeTask, status: newStatus! },
      ],
    }));

    console.log(`🎯 Task ${activeTask.id} moved from ${oldStatus} to ${newStatus}`);

    // Update on backend
    try {
      const response = await updateTaskStatus(activeTask.id, newStatus);

      if (!response.success) {
        console.error('❌ Failed to update task status:', response.error);
        // Revert on error
        setTasks((prev) => ({
          ...prev,
          [oldStatus]: [...prev[oldStatus], activeTask],
          [newStatus!]: prev[newStatus!].filter((t) => t.id !== activeTask.id),
        }));
        setError('Failed to update task status');
      } else {
        console.log('✅ Task status updated successfully');
      }
    } catch (err) {
      console.error('❌ Error updating task status:', err);
      // Revert on error
      setTasks((prev) => ({
        ...prev,
        [oldStatus]: [...prev[oldStatus], activeTask],
        [newStatus!]: prev[newStatus!].filter((t) => t.id !== activeTask.id),
      }));
      setError('Failed to update task');
    }
  };

  /**
   * Handle task deletion
   */
  const handleDeleteTask = async (taskId: number | string, status: TaskStatus) => {
    // Remove from UI immediately
    setTasks((prev) => ({
      ...prev,
      [status]: prev[status].filter((t) => t.id !== taskId),
    }));

    try {
      const response = await deleteTask(taskId);

      if (!response.success) {
        // Reload tasks on error
        loadTasks();
        setError('Failed to delete task');
      }
    } catch (err) {
      // Reload tasks on error
      loadTasks();
      setError('Failed to delete task');
    }
  };

  const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="w-full h-full p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Board</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Drag tasks between columns to change their status
            </p>
          </div>
          <Button
            onClick={() => setOpenCreateDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => {
            setActiveId(event.active.id);
            console.log('Drag started:', event.active.id);
          }}
        >
          <SortableContext
            items={statuses}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-4 gap-6 w-full">
              {statuses.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  title={columnConfig[status].title}
                  color={columnConfig[status].color}
                  tasks={tasks[status]}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-400 cursor-grabbing max-w-xs">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Moving task...
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {!loading && Object.values(tasks).every((t) => t.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No tasks yet. Create a new task to get started!
          </p>
          <Button onClick={() => setOpenCreateDialog(true)}>Create First Task</Button>
        </div>
      )}

      <CreateTaskDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onTaskCreated={loadTasks}
      />
    </div>
  );
};

export default KanbanBoard;
