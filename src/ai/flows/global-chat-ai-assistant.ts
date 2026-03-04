'use server';
/**
 * @fileOverview An AI assistant for the global chat feature that answers questions about clients/leads.
 *
 * - getLeadInfo - A function that handles the process of retrieving lead information.
 * - GetLeadInfoInput - The input type for the getLeadInfo function.
 * - GetLeadInfoOutput - The return type for the getLeadInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLeadInfoInputSchema = z.object({
  question: z.string().describe('The question about the lead.'),
  leadId: z.string().describe('The ID of the lead.'),
});
export type GetLeadInfoInput = z.infer<typeof GetLeadInfoInputSchema>;

const GetLeadInfoOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the lead.'),
});
export type GetLeadInfoOutput = z.infer<typeof GetLeadInfoOutputSchema>;

export async function getLeadInfo(input: GetLeadInfoInput): Promise<GetLeadInfoOutput> {
  return getLeadInfoFlow(input);
}

const getLeadInfoPrompt = ai.definePrompt({
  name: 'getLeadInfoPrompt',
  input: {schema: GetLeadInfoInputSchema},
  output: {schema: GetLeadInfoOutputSchema},
  prompt: `You are an expert commercial AI assistant for a martial arts academy. 
  Your goal is to answer questions about specific leads in the system.
  Provide accurate, concise, and professional responses.

  Question: {{{question}}}
  Lead ID: {{{leadId}}}`,
});

const getLeadInfoFlow = ai.defineFlow(
  {
    name: 'getLeadInfoFlow',
    inputSchema: GetLeadInfoInputSchema,
    outputSchema: GetLeadInfoOutputSchema,
  },
  async input => {
    const {output} = await getLeadInfoPrompt(input);
    return output!;
  }
);
