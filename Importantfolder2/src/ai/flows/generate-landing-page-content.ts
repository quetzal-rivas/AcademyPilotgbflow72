'use server';

/**
 * @fileOverview A flow to generate content for a lead-capturing landing page based on business details.
 *
 * - generateLandingPageContent - A function that handles the generation of landing page content.
 * - GenerateLandingPageContentInput - The input type for the generateLandingPageContent function.
 * - GenerateLandingPageContentOutput - The return type for the generateLandingPageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLandingPageContentInputSchema = z.object({
  companyInfo: z.object({
    name: z.string().describe('The name of the business.'),
    description: z.string().describe('A detailed description of the business.'),
    phone: z.string().describe('The business phone number.'),
    hours: z.string().optional().describe('The business operation hours.'),
    socialLinks: z.array(z.string()).optional().describe('An array of social media links for the business.'),
  }),
  media: z.object({
      coverImage: z.string().optional().describe(
        "A cover image for the business, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
      galleryImages: z.array(z.string()).optional().describe(
        "An array of gallery images for the business, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
      promotionalVideo: z.string().optional().describe(
        "A promotional video for the business, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
  }),
  offerings: z.array(z.object({
      name: z.string(),
      description: z.string(),
      image: z.string().optional(),
  })).optional().describe('An array of products or services offered by the business.'),
});

export type GenerateLandingPageContentInput = z.infer<typeof GenerateLandingPageContentInputSchema>;

const GenerateLandingPageContentOutputSchema = z.object({
  headline: z.string().describe('A compelling headline for the landing page.'),
  body: z.string().describe('The main body content of the landing page, optimized for lead capture.'),
  callToAction: z.string().describe('A clear call to action for visitors.'),
  suggestedLayout: z.string().describe('A suggested layout for the landing page based on the content.'),
});

export type GenerateLandingPageContentOutput = z.infer<typeof GenerateLandingPageContentOutputSchema>;

export async function generateLandingPageContent(
  input: GenerateLandingPageContentInput
): Promise<GenerateLandingPageContentOutput> {
  return generateLandingPageContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLandingPageContentPrompt',
  input: {schema: GenerateLandingPageContentInputSchema},
  output: {schema: GenerateLandingPageContentOutputSchema},
  prompt: `You are an expert copywriter specializing in creating high-converting landing pages.

  Based on the following business details, generate content for a landing page optimized for lead capture.

  Business Name: {{{companyInfo.name}}}
  Description: {{{companyInfo.description}}}
  Phone Number: {{{companyInfo.phone}}}
  Social Media Links: {{#each companyInfo.socialLinks}}{{{this}}} {{/each}}
  Operation Hours: {{{companyInfo.hours}}}

  Offerings:
  {{#each offerings}}
  - Name: {{{this.name}}}
    Description: {{{this.description}}}
    Image Available: {{#if this.image}}Yes{{else}}No{{/if}}
  {{/each}}
  
  Media:
  Cover Image: {{#if media.coverImage}}{{media url=media.coverImage}}{{/if}}
  Gallery Images:
  {{#each media.galleryImages}}
    {{media url=this}}
  {{/each}}
  Promotional Video: {{#if media.promotionalVideo}}Yes{{else}}No{{/if}}

  Create a compelling headline, body content, and a clear call to action. Also, suggest a suitable layout for the landing page.
  Ensure that the landing page is optimized for lead capture.

  Remember, the output should include:
  - headline: A short, attention-grabbing headline.
  - body: Engaging content that highlights the business's value proposition and encourages visitors to take action.
  - callToAction: A clear and concise call to action (e.g., "Get a Free Quote," "Sign Up Today").
  - suggestedLayout: A suggestion for the landing page layout (e.g., "Single Column," "Two Columns with Image").`,
});

const generateLandingPageContentFlow = ai.defineFlow(
  {
    name: 'generateLandingPageContentFlow',
    inputSchema: GenerateLandingPageContentInputSchema,
    outputSchema: GenerateLandingPageContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
