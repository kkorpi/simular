import { TaskSection } from "./TaskSection";
import { TaskItem } from "./TaskItem";
import { activeTasks as defaultActiveTasks, recurringTasks as defaultRecurringTasks, completedTasks as defaultCompletedTasks, type Task, type TeachPhase } from "@/data/mockData";

export function TasksTab({
  onSelectTask,
  teachPhase = "idle",
  teachTaskName,
  activeTasksOverride,
  recurringTasksOverride,
  completedTasksOverride,
}: {
  onSelectTask: (task: Task) => void;
  teachPhase?: TeachPhase;
  teachTaskName?: string;
  activeTasksOverride?: Task[];
  recurringTasksOverride?: Task[];
  completedTasksOverride?: Task[];
}) {
  const activeTasks = activeTasksOverride ?? defaultActiveTasks;
  const recurringTasks = recurringTasksOverride ?? defaultRecurringTasks;
  const completedTasks = completedTasksOverride ?? defaultCompletedTasks;
  const isTeachActive = teachPhase === "recording";
  const isTeachDone = teachPhase === "complete";

  const teachActiveTask: Task | null = isTeachActive
    ? {
        id: "teach-active",
        name: teachTaskName || "Recording task",
        status: "running",
        subtitle: "Learning mode",
        time: "now",
        thumbEmoji: "📖",
        thumbStatus: "Recording steps",
      }
    : null;

  const teachRecurringTask: Task | null = isTeachDone
    ? {
        id: "teach-recurring",
        name: teachTaskName || "Learned task",
        status: "recurring",
        subtitle: "Every Monday 9am",
        time: "Mon 9am",
        thumbEmoji: "📖",
        thumbStatus: "Learned task",
      }
    : null;

  const activeCount = activeTasks.length + (isTeachActive ? 1 : 0);
  const recurringCount = recurringTasks.length + (isTeachDone ? 1 : 0);

  return (
    <div>
      {/* Task list */}
      <div className="px-2.5 pt-2.5 pb-2">
        <TaskSection label="Active" count={activeCount}>
          {teachActiveTask && (
            <TeachTaskItem task={teachActiveTask} />
          )}
          {activeTasks.map((t) => (
            <TaskItem key={t.id} task={t} onClick={() => onSelectTask(t)} />
          ))}
        </TaskSection>

        <TaskSection label="Recurring" count={recurringCount}>
          {teachRecurringTask && (
            <TeachTaskItem task={teachRecurringTask} />
          )}
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

/** Inline teach task item with violet accent — non-clickable (no detail view) */
function TeachTaskItem({ task }: { task: Task }) {
  const isRecording = task.status === "running";

  return (
    <div className="group relative flex items-start gap-2 rounded-lg px-2.5 py-2 bg-teach/[0.06]">
      <div
        className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${
          isRecording ? "bg-teach animate-pulse" : "bg-teach"
        }`}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-t1">{task.name}</div>
        <div className="text-[10.5px] text-teach-text">{task.subtitle}</div>
      </div>
      <div className="mt-px shrink-0 font-mono text-[10.5px] text-t4">{task.time}</div>
    </div>
  );
}
