"use server";

import {
  generateLandingPageContent,
  type GenerateLandingPageContentInput,
} from "@/ai/flows/generate-landing-page-content";
import { z } from "zod";
import { formSchema } from "@/lib/schemas";

export async function generateContentAction(
  formData: z.infer<typeof formSchema>
) {
  try {
    // We parse to ensure the data is valid before sending to the Genkit flow.
    const validatedData = formSchema.parse(formData);
    
    // The formData is already in the correct nested structure, so we can pass it directly.
    const aiPayload: GenerateLandingPageContentInput = {
      ...validatedData,
      companyInfo: {
          ...validatedData.companyInfo,
          hours: validatedData.companyInfo.hours || '',
          socialLinks: validatedData.companyInfo.socialLinks || []
      },
      media: {
          coverImage: validatedData.media?.coverImage || '',
          galleryImages: validatedData.media?.galleryImages || [],
          promotionalVideo: validatedData.media?.promotionalVideo || ''
      },
      offerings: validatedData.offerings || []
    };
    
    const generatedContent = await generateLandingPageContent(aiPayload);
    return { success: true, data: generatedContent };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
       return { success: false, error: "Validation failed: " + error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: "Failed to generate content. Please try again." };
  }
}
