// Answer scale used for every question: value 0 to 4.
export const OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];

// reverse: true means a HIGH answer is a good sign, so it is flipped before scoring.
export const QUESTIONS = [
  { id: 1, category: 'Sleep', text: 'How often did you have trouble falling or staying asleep this week?' },
  { id: 2, category: 'Workload', text: 'How often did your workload or studies feel too much to handle?' },
  { id: 3, category: 'Anxiety', text: 'How often did you feel anxious or on edge?' },
  { id: 4, category: 'Control', text: 'How often did you feel unable to control the important things in your life?' },
  { id: 5, category: 'Confidence', text: 'How often did you feel confident about handling your problems?', reverse: true },
  { id: 6, category: 'Outlook', text: 'How often did you feel that things were going your way?', reverse: true },
  { id: 7, category: 'Physical', text: 'How often did you have headaches, tension or tiredness without a clear reason?' },
  { id: 8, category: 'Social', text: 'How often did you avoid friends or family because you felt overwhelmed?' },
  { id: 9, category: 'Focus', text: 'How often did you find it hard to concentrate on your tasks?' },
  { id: 10, category: 'Relaxation', text: 'How often were you able to relax and enjoy your free time?', reverse: true },
];
