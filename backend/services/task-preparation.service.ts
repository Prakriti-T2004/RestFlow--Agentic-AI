import SessionModel, { ITask } from '../models/Session';

function buildPreparationSteps(task: ITask, context: string): string[] {
  const title = task.title.toLowerCase();
  const steps = [
    `Review the task goal: ${task.title}`,
    `Extract the high-signal concepts from ${title.includes('mock') ? 'interview practice' : 'the task topic'}.`,
    `Break the topic into foundations, practice, and review checkpoints.`,
    `Create a short execution checklist and evidence-based review notes.`,
  ];

  if (context) {
    steps.splice(1, 0, 'Cross-check the plan against the uploaded resume and target role.');
  }

  return steps;
}

export async function generateTaskPreparation(sessionId: string, taskIndex: number) {
  const session = await SessionModel.findById(sessionId).exec();
  if (!session) throw new Error('Session not found');

  const task = session.tasks?.[taskIndex];
  if (!task) throw new Error('Task not found');

  const context = session.resumeText || session.extraContext || '';
  const summary = `A full preparation package for ${task.title} focused on your role, deadline, and available context.`;
  const steps = buildPreparationSteps(task, context);

  await SessionModel.updateOne(
    { _id: sessionId },
    {
      $set: {
        [`tasks.${taskIndex}.prepStatus`]: 'completed',
        [`tasks.${taskIndex}.prepSummary`]: summary,
        [`tasks.${taskIndex}.prepSteps`]: steps,
      },
      $push: {
        activityLog: {
          stage: 'task-preparation',
          message: `Generated full preparation for ${task.title}.`,
          details: steps.join(' | '),
          createdAt: new Date(),
        },
      },
    }
  ).exec();

  return {
    taskIndex,
    prepStatus: 'completed',
    prepSummary: summary,
    prepSteps: steps,
  };
}