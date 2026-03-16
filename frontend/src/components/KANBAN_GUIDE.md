# Kanban Board Feature

## Overview

A visual drag-and-drop Kanban board for managing tasks through different workflow stages. Tasks flow through 4 columns representing different states in the task lifecycle.

## Features

✅ **4 Task Columns**
- **New Task (TODO)** - Newly created tasks
- **Assigned (IN_PROGRESS)** - Tasks being worked on
- **Reviewing (COMPLETED)** - Tasks under review
- **Done (CANCELLED)** - Completed & approved tasks

✅ **Drag & Drop**
- Drag tasks between columns to change status
- Smooth animations and visual feedback
- Real-time backend synchronization

✅ **Task Management**
- View task details (title, description, priority, due date)
- Delete tasks with one click
- Task counters per column
- Priority and tag badges

✅ **Real-time Sync**
- Tasks automatically sync with backend
- Error handling with automatic rollback
- Loading states and error messages

## Files Structure

```
frontend/src/
├── components/
│   ├── KanbanBoard.tsx       # Main board component
│   ├── KanbanColumn.tsx      # Individual column
│   ├── TaskCard.tsx          # Draggable task card
│   └── ...
├── service/
│   ├── taskService.ts        # Task API calls
│   └── ...
└── pages/
    └── Dashboard.tsx         # Dashboard with Board tab
```

## Component Architecture

### KanbanBoard.tsx
Main component that:
- Fetches all tasks from backend
- Groups tasks by status
- Handles drag & drop events
- Manages task deletion
- Provides error handling and loading states

**Key Props**: None (uses services directly)

**Key Functions**:
- `loadTasks()` - Fetch tasks from API
- `handleDragEnd()` - Update task status when dropped
- `handleDeleteTask()` - Remove task from board and API

### KanbanColumn.tsx
Displays a single column that:
- Uses `@dnd-kit/core` droppable zone
- Shows task count badge
- Renders sortable task list
- Empty state message

**Props**:
- `status: TaskStatus` - Column's task status
- `title: string` - Display name
- `color: string` - Background color class
- `tasks: Task[]` - Tasks in column
- `onDeleteTask: (taskId, status) => void` - Delete handler

### TaskCard.tsx
Draggable task card that:
- Uses `@dnd-kit/sortable` for drag functionality
- Shows task metadata (title, description, priority, due date)
- Delete button
- Drag handle icon
- Visual feedback during dragging

**Props**:
- `task: Task` - Task object
- `status: TaskStatus` - Current status
- `onDelete: () => void` - Delete handler

## Task Status Flow

```
New Task (TODO)
    ↓ [Drag to next column]
Assigned (IN_PROGRESS)
    ↓ [Drag to next column]
Reviewing (COMPLETED)
    ↓ [Drag to next column]
Done (CANCELLED)
    ↓ [Click delete button]
Removed from Board
```

## Backend Integration

### Required Endpoints
```
GET /api/tasks
  - Returns all tasks

PUT /api/tasks/{id}
  - Updates task status
  - Body: { status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }

PATCH /api/tasks/{id}/status
  - Alternative endpoint for status update
  - Body: { status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }

DELETE /api/tasks/{id}
  - Deletes a task
```

## Task Object Structure

```typescript
type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tags?: string[];
};

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
```

## Usage

### In Dashboard
```tsx
import KanbanBoard from '../components/KanbanBoard';

// Inside Dashboard component
{activeTab === "board" && <KanbanBoard />}
```

### Accessing from Navigation
1. Click "Board" in the sidebar
2. Board tab activates and shows the Kanban board
3. Drag tasks between columns to change status
4. Click trash icon to delete a task

## Styling & UI

### Colors by Column
- **New Task (TODO)**: Gray
- **Assigned (IN_PROGRESS)**: Blue
- **Reviewing (COMPLETED)**: Purple
- **Done (CANCELLED)**: Green

### Components Used
- `Card` - shadcn card for task and column containers
- `Badge` - For priority, status, and tag display
- `Button` - Delete button
- `@dnd-kit/core` - Drag and drop context
- `@dnd-kit/sortable` - Sortable task items
- `lucide-react` - Icons (trash, grip, loader)

## Error Handling

### Scenarios Handled
1. **Failed to load tasks**
   - Shows error message with dismiss button
   - Allows retry with reload
   
2. **Failed to update status**
   - Automatically reverts task to previous column
   - Shows error notification
   
3. **Failed to delete task**
   - Reloads all tasks from API
   - Shows error notification

### User Feedback
- Loading spinner while fetching
- Toast-like error messages
- Optimistic UI updates with rollback

## Performance Optimizations

✅ **Lazy Loading** - Tasks loaded on mount only
✅ **Optimistic Updates** - UI updates before API response
✅ **Error Boundaries** - Graceful error recovery
✅ **Memoization** - Components prevent unnecessary re-renders
✅ **Virtual Scrolling Ready** - Supports large task lists

## Dependencies

```json
{
  "@dnd-kit/core": "^6.x",
  "@dnd-kit/utilities": "^3.x",
  "@dnd-kit/sortable": "^7.x"
}
```

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+

## Future Enhancements

- [ ] Task creation modal
- [ ] Task details panel
- [ ] Filtering by assignee/priority
- [ ] Due date sorting
- [ ] Task search
- [ ] Bulk operations
- [ ] Custom columns
- [ ] Filters and views
- [ ] Comments on tasks
- [ ] Notifications

## Troubleshooting

### Tasks not loading?
- Check network tab in DevTools
- Verify backend is running on localhost:8080
- Check if token is valid

### Drag and drop not working?
- Verify @dnd-kit packages are installed
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)

### Status not updating?
- Check browser console for API errors
- Verify backend endpoint is correct
- Check request body in Network tab

## Code Examples

### Fetch and display tasks
```tsx
const response = await getAllTasks();
if (response.success) {
  const grouped: TasksGrouped = {
    TODO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    CANCELLED: [],
  };
  response.data.forEach(task => {
    grouped[task.status].push(task);
  });
  setTasks(grouped);
}
```

### Update task status
```tsx
const response = await updateTaskStatus(taskId, 'IN_PROGRESS');
if (response.success) {
  // Task updated successfully
} else {
  // Revert changes
}
```

### Delete task
```tsx
const response = await deleteTask(taskId);
if (response.success) {
  // Task deleted - already removed from UI
} else {
  // Reload tasks on error
}
```

---

Built with React, dnd-kit, and shadcn/ui components.
