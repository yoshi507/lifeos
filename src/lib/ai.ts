import type { AIAction, Task, Goal, Habit, Note, CalendarEvent } from "@/types";
import { format, addDays, nextFriday, setHours, setMinutes, startOfWeek } from "date-fns";

interface Context {
  tasks: Task[];
  events: CalendarEvent[];
  notes: Note[];
  goals: Goal[];
  habits: Habit[];
}

function parseDateMention(text: string): string | undefined {
  const lower = text.toLowerCase();
  const today = new Date();
  if (lower.includes("today")) return today.toISOString();
  if (lower.includes("tomorrow")) return addDays(today, 1).toISOString();
  if (lower.includes("friday") || lower.includes("on friday")) {
    return nextFriday(today).toISOString();
  }
  if (lower.includes("next week")) return addDays(today, 7).toISOString();
  if (lower.includes("monday")) return addDays(startOfWeek(today, { weekStartsOn: 1 }), 0).toISOString();
  const daysMatch = lower.match(/in (\d+) days?/);
  if (daysMatch) return addDays(today, parseInt(daysMatch[1])).toISOString();
  return undefined;
}

export async function processAIMessage(
  message: string,
  context: Context
): Promise<{ reply: string; actions: AIAction[] }> {
  const lower = message.toLowerCase().trim();
  const actions: AIAction[] = [];
  let reply = "";

  if (
    lower.includes("plan my week") ||
    lower.includes("plan the week") ||
    lower.includes("weekly plan") ||
    (lower.includes("plan") && (lower.includes("week") || lower.includes("schedule")))
  ) {
    const hasSchool = lower.includes("school") || lower.includes("study") || lower.includes("class");
    const hasExercise = lower.includes("exercise") || lower.includes("workout") || lower.includes("gym") || lower.includes("fitness");
    const hasProject = lower.includes("project") || lower.includes("deadline");

    const base = startOfWeek(new Date(), { weekStartsOn: 1 });

    if (hasSchool) {
      actions.push({
        type: "create_task",
        data: {
          title: "Prepare for school / study block",
          description: "Dedicated study time as requested",
          priority: "high",
          dueDate: addDays(base, 1).toISOString(),
          tags: ["school", "study"],
          status: "todo",
        },
      });
      actions.push({
        type: "create_event",
        data: {
          title: "Study session",
          start: setHours(setMinutes(addDays(base, 1), 0), 14).toISOString(),
          end: setHours(setMinutes(addDays(base, 1), 0), 16).toISOString(),
          allDay: false,
          color: "#6366f1",
        },
      });
    }

    if (hasExercise) {
      for (let i = 0; i < 3; i++) {
        const day = addDays(base, 1 + i * 2);
        actions.push({
          type: "create_event",
          data: {
            title: "Exercise / Workout",
            start: setHours(setMinutes(day, 0), 7).toISOString(),
            end: setHours(setMinutes(day, 30), 7).toISOString(),
            allDay: false,
            color: "#10b981",
          },
        });
      }
      actions.push({
        type: "create_habit",
        data: {
          title: "Daily movement",
          frequency: "daily",
          color: "#10b981",
        },
      });
    }

    if (hasProject || lower.includes("remind me about my project")) {
      const friday = nextFriday(new Date());
      actions.push({
        type: "create_task",
        data: {
          title: "Work on project",
          description: "Reminder set for Friday as requested",
          priority: "high",
          dueDate: friday.toISOString(),
          tags: ["project", "important"],
          status: "todo",
        },
      });
      actions.push({
        type: "create_event",
        data: {
          title: "Project focus time",
          start: setHours(setMinutes(friday, 0), 10).toISOString(),
          end: setHours(setMinutes(friday, 0), 12).toISOString(),
          allDay: false,
          color: "#ef4444",
        },
      });
    }

    actions.push({
      type: "create_task",
      data: {
        title: "Weekly review & plan next week",
        priority: "medium",
        dueDate: addDays(base, 6).toISOString(),
        tags: ["review"],
        status: "todo",
      },
    });

    reply = `I've planned your week! 🗓️✨\n\nHere's what I set up:\n`;
    if (hasSchool) reply += `• Study blocks for school\n`;
    if (hasExercise) reply += `• Exercise sessions (3x this week) + a daily movement habit\n`;
    if (hasProject) reply += `• Project work scheduled for Friday with a reminder task\n`;
    reply += `• A weekly review task for Sunday\n\nCheck your Tasks and Calendar — everything is ready! You can tweak times as needed.`;
  }

  else if (
    lower.startsWith("add task") ||
    lower.startsWith("create task") ||
    lower.startsWith("new task") ||
    lower.includes("remind me to") ||
    lower.includes("todo:") ||
    (lower.includes("add") && lower.includes("task"))
  ) {
    let title = message
      .replace(/^(add|create|new)\s+task[:\s]*/i, "")
      .replace(/^remind me to\s*/i, "")
      .replace(/^todo:\s*/i, "")
      .trim();
    if (!title) title = "New task";
    const due = parseDateMention(message);
    const priority: "high" | "medium" | "low" =
      lower.includes("urgent") || lower.includes("important") || lower.includes("high")
        ? "high"
        : lower.includes("low")
        ? "low"
        : "medium";

    actions.push({
      type: "create_task",
      data: {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        priority,
        dueDate: due,
        status: "todo",
        tags: [],
      },
    });
    reply = `✅ Task created: **${title}**${due ? ` (due ${format(new Date(due), "EEE, MMM d")})` : ""}\n\nIt's now in your task list!`;
  }

  else if (
    lower.includes("create goal") ||
    lower.includes("new goal") ||
    lower.includes("set a goal") ||
    lower.includes("my goal is")
  ) {
    let title = message
      .replace(/.*(create|new|set a)\s+goal[:\s]*/i, "")
      .replace(/.*my goal is\s*/i, "")
      .trim();
    if (!title) title = "New goal";
    actions.push({
      type: "create_goal",
      data: {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        progress: 0,
        status: "active",
      },
    });
    if (title.length > 20) {
      actions.push({
        type: "create_task",
        data: {
          title: `First step: ${title.slice(0, 40)}...`,
          priority: "medium",
          status: "todo",
          tags: ["goal"],
        },
      });
    }
    reply = `🎯 Goal created: **${title}**\n\nI've also added a first-step task so you can start making progress right away!`;
  }

  else if (
    lower.includes("add habit") ||
    lower.includes("create habit") ||
    lower.includes("new habit") ||
    (lower.includes("track") && lower.includes("habit"))
  ) {
    let title = message
      .replace(/.*(add|create|new)\s+habit[:\s]*/i, "")
      .replace(/.*track\s+/i, "")
      .trim();
    if (!title) title = "New habit";
    actions.push({
      type: "create_habit",
      data: {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        frequency: "daily",
      },
    });
    reply = `🔥 Habit added: **${title}**\n\nStart checking it off daily to build your streak!`;
  }

  else if (
    lower.includes("create note") ||
    lower.includes("new note") ||
    lower.includes("write a note") ||
    lower.startsWith("note:")
  ) {
    let title = "Quick note";
    let content = message.replace(/.*(create|new|write a)\s+note[:\s]*/i, "").replace(/^note:\s*/i, "").trim();
    if (content.length > 50) {
      title = content.slice(0, 40) + "...";
    } else if (content) {
      title = content;
      content = "";
    }
    actions.push({
      type: "create_note",
      data: { title, content: content || title },
    });
    reply = `📝 Note saved: **${title}**`;
  }

  else if (
    lower.includes("schedule") ||
    lower.includes("add event") ||
    lower.includes("create event") ||
    lower.includes("meeting")
  ) {
    let title = message
      .replace(/.*(schedule|add|create)\s+(an?\s+)?(event|meeting)[:\s]*/i, "")
      .trim() || "New event";
    const start = parseDateMention(message) || new Date().toISOString();
    actions.push({
      type: "create_event",
      data: {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        start,
        end: addDays(new Date(start), 0).toISOString(),
        allDay: !lower.includes("at ") && !lower.includes(":"),
      },
    });
    reply = `📅 Event added: **${title}**\n\nCheck your calendar!`;
  }

  else if (
    lower.includes("how am i doing") ||
    lower.includes("productivity") ||
    lower.includes("stats") ||
    lower.includes("analyse") ||
    lower.includes("analyze") ||
    lower.includes("progress")
  ) {
    const done = context.tasks.filter((t) => t.status === "done").length;
    const total = context.tasks.length;
    const activeGoals = context.goals.filter((g) => g.status === "active");
    const avgProgress =
      activeGoals.length > 0
        ? Math.round(
            activeGoals.reduce((a, g) => a + g.progress, 0) / activeGoals.length
          )
        : 0;
    const habitsToday = context.habits.filter((h) =>
      h.completedDates.includes(new Date().toISOString().slice(0, 10))
    ).length;

    reply = `📊 Here's your productivity snapshot:\n\n`;
    reply += `• Tasks: ${done}/${total} completed\n`;
    reply += `• Active goals: ${activeGoals.length} (avg progress ${avgProgress}%)\n`;
    reply += `• Habits checked today: ${habitsToday}/${context.habits.length}\n\n`;

    if (done / (total || 1) > 0.6) {
      reply += `You're crushing it! 🔥 Keep the momentum going.`;
    } else if (total === 0) {
      reply += `No tasks yet — want me to help you plan some?`;
    } else {
      reply += `Suggestion: Focus on your highest priority tasks first. Want me to prioritise them for you?`;
    }
  }

  else if (lower.includes("suggest habit") || lower.includes("recommend habit") || lower.includes("habit ideas")) {
    reply = `Here are some high-impact habits I recommend 💡\n\n`;
    reply += `1. **Morning pages** (10 min journaling)\n`;
    reply += `2. **2L water daily**\n`;
    reply += `3. **20-minute walk** after lunch\n`;
    reply += `4. **No screens 30 min before bed**\n`;
    reply += `5. **Weekly review** every Sunday\n\n`;
    reply += `Want me to add any of these for you? Just say e.g. "add habit morning pages"`;
  }

  else if (lower.includes("summarise") || lower.includes("summarize") || lower.includes("summary of notes")) {
    if (context.notes.length === 0) {
      reply = "You don't have any notes yet. Create one and I can summarise it!";
    } else {
      reply = `📝 Notes summary (${context.notes.length} notes):\n\n`;
      context.notes.slice(0, 5).forEach((n, i) => {
        reply += `${i + 1}. **${n.title}** — ${n.content.slice(0, 80)}${n.content.length > 80 ? "..." : ""}\n`;
      });
      if (context.notes.length > 5) reply += `\n...and ${context.notes.length - 5} more.`;
    }
  }

  else if (lower.includes("break down") || lower.includes("break into tasks") || lower.includes("split goal")) {
    const goal = context.goals.find((g) => g.status === "active") || context.goals[0];
    if (!goal) {
      reply = "You don't have any goals yet. Create one first!";
    } else {
      const steps = [
        `Research & clarify scope for "${goal.title}"`,
        `Define success metrics`,
        `Create first milestone`,
        `Schedule weekly progress check`,
      ];
      steps.forEach((s) => {
        actions.push({
          type: "create_task",
          data: {
            title: s,
            priority: "medium",
            status: "todo",
            tags: ["goal", goal.title.slice(0, 20)],
          },
        });
      });
      reply = `🎯 I broke down **${goal.title}** into ${steps.length} actionable tasks. They're now in your task list!`;
    }
  }

  else if (lower.includes("show tasks") || lower.includes("my tasks") || lower.includes("list tasks")) {
    const open = context.tasks.filter((t) => t.status !== "done");
    if (open.length === 0) {
      reply = "You have no open tasks — nice work! 🎉 Want me to create some?";
    } else {
      reply = `Here are your open tasks (${open.length}):\n\n`;
      open.slice(0, 8).forEach((t, i) => {
        reply += `${i + 1}. [${t.priority}] ${t.title}${t.dueDate ? ` — due ${format(new Date(t.dueDate), "MMM d")}` : ""}\n`;
      });
    }
  }

  else if (lower.includes("help") || lower === "?" || lower.includes("what can you do")) {
    reply = `I'm your LifeOS AI co-pilot 🚀 Here's what I can do:\n\n`;
    reply += `• **Plan my week around X** — create schedules, tasks & habits\n`;
    reply += `• **Add task / remind me to ...**\n`;
    reply += `• **Create goal / break down goal**\n`;
    reply += `• **Add habit**\n`;
    reply += `• **Schedule meeting / add event**\n`;
    reply += `• **How am I doing?** — productivity analysis\n`;
    reply += `• **Suggest habits**\n`;
    reply += `• **Summarise notes**\n`;
    reply += `• **Show my tasks**\n\n`;
    reply += `Just talk naturally — I'll figure it out!`;
  }

  else {
    reply = `I heard: "${message}"\n\n`;
    if (lower.includes("thank")) {
      reply = "You're welcome! 😊 Anything else I can help organise?";
    } else {
      reply += `I'm not 100% sure what you'd like me to create, but I can:\n`;
      reply += `• Turn this into a **task**\n`;
      reply += `• Create a **goal** from it\n`;
      reply += `• Add it as a **note**\n`;
      reply += `• Or help you **plan your week**\n\n`;
      reply += `Just clarify or say e.g. "add task ${message.slice(0, 40)}"`;
    }
  }

  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

  return { reply, actions };
}
