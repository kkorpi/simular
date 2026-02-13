import { TaskSection } from "./TaskSection";
import { TaskItem } from "./TaskItem";
import { activeTasks, recurringTasks, completedTasks, type Task } from "@/data/mockData";

export function TasksTab({ onSelectTask }: { onSelectTask: (task: Task) => void }) {
  return (
    <div>
      {/* Summary bar */}
      <div className="flex gap-3 border-b border-b1 px-3.5 py-2.5 text-[11px] text-t3">
        <div className="flex items-center gap-[5px]">
          <div className="h-[5px] w-[5px] rounded-full bg-g" />
          2 active
        </div>
        <div className="flex items-center gap-[5px]">
          <div className="h-[5px] w-[5px] rounded-full bg-am" />
          3 recurring
        </div>
        <div className="flex items-center gap-[5px]">
          <div className="h-[5px] w-[5px] rounded-full bg-t4" />
          {completedTasks.length} done today
        </div>
      </div>

      {/* Task list */}
      <div className="px-2.5 py-2">
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

        <TaskSection label="Completed today" count={completedTasks.length}>
          {completedTasks.map((t) => (
            <TaskItem key={t.id} task={t} onClick={() => onSelectTask(t)} />
          ))}
        </TaskSection>
      </div>
    </div>
  );
}
