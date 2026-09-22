import { useState } from 'react';

export function useWorkspaceGreeting(user, workCopy, fallbackSubtitle = '') {
  const messages = Array.isArray(workCopy.greetingMessages) && workCopy.greetingMessages.length
    ? workCopy.greetingMessages
    : [fallbackSubtitle];
  const [messageIndex] = useState(() => Math.floor(Math.random() * messages.length));
  const firstName = String(user?.name || '').trim().split(/\s+/)[0] || user?.name || '';
  const title = String(workCopy.greeting || 'Hi, {name}!').replace('{name}', firstName);

  return {
    title,
    subtitle: messages[messageIndex] || fallbackSubtitle,
  };
}
