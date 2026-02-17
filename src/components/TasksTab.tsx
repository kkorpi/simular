import { TaskSection } from "./TaskSection";
import { TaskItem } from "./TaskItem";
import { activeTasks, recurringTasks, completedTasks, type Task } from "@/data/mockData";

export function TasksTab({ onSelectTask }: { onSelectTask: (task: Task) => void }) {
  return (
    <div>
      {/* Task list */}
      <div className="px-2.5 pt-2.5 pb-2">
        <TaskSection label="Active" count={activeTasks.length}>
          {activeTasks.map((t) => (
            <TaskItem key={t.id} task={t} onClick={() => onSelectTask(t)} />
          ))}
        </TaskSection>

        <TaskSection label="Recurring" count={recurringTasks.length}>
          {recurringTasks.map((t) => (
            <TaskItem key={t.id} task={t} onClick={() => onSelectTask(t)} />
          ))}
        </TaskSection>

        <TaskSection label="Completed today" count={completedTasks.length} defaultOpen={false}>
          {completedTasks.map((t) => (
            <TaskItem key={t.id} task={t} onClick={() => onSelectTask(t)} />
          ))}
        </TaskSection>
      </div>
    </div>
  );
}
