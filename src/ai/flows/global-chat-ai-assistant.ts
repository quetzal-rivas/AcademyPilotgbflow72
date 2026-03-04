'use server';

/**
 * @fileOverview Refactored AI assistant flow supporting persistent chat history and tool calling.
 *
 * - chatAssistant - A function that handles the conversational process.
 * - ChatAssistantInput - The input type for the chatAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { callExternalApi } from '@/ai/tools/call-external-api';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.array(z.object({ text: z.string().optional() })),
});

const ChatAssistantInputSchema = z.object({
  history: z.array(MessageSchema).optional().describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

export async function chatAssistant(input: ChatAssistantInput) {
  // We use ai.generate with the history array to maintain context.
  // The system prompt defines the "Manual" for the callExternalApi tool.
  const response = await ai.generate({
    history: input.history as any,
    prompt: input.message,
    tools: [callExternalApi],
    system: `You are the Academy Operations Controller. Your mission is to provide tactical support to the academy staff.
    
### OPERATIONAL DIRECTIVE:
- Use the 'callExternalApi' tool to execute backend actions.
- Base URL for internal services: 'https://api.your-academy-domain.com'
- Maintain a professional, disciplined, and efficient tone (Gracie Barra standard).
- If a request lacks required parameters (like an email or lead ID), ask for clarification before engaging the tool.

### TACTICAL BACKEND DIRECTORY:
1. Lead Management
   - Add Lead: POST /add-lead | Body: { name, email, phone, source }
   - Get Leads: GET /get-leads | Params: ?status=active|processed
   - Mark Processed: POST /mark-processed | Body: { leadId }

2. Scheduling & Ops
   - Get Schedule: GET /get-schedule | Params: ?date=YYYY-MM-DD
   - Trigger Outbound Call: POST /trigger-outbound-call | Body: { leadId, agentId }

Today's date is ${new Date().toISOString().split('T')[0]}.`,
  });

  return {
    text: response.text,
    history: response.history, // Return history so it can be persisted by the client
  };
}
