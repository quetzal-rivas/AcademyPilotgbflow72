'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface BusinessInfoFormProps {
  onImageUpload: (base64Images: string[]) => void;
  galleryImages: string[];
  onVideoUpload: (base64Video: string) => void;
  promotionalVideo?: string;
}

export function BusinessInfoForm({ onImageUpload, galleryImages, onVideoUpload, promotionalVideo }: BusinessInfoFormProps) {
  const { control } = useFormContext();

  const {
    fields: offeringFields,
    append: appendOffering,
    remove: removeOffering,
  } = useFieldArray({ control, name: 'offerings' });
  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: 'companyInfo.socialLinks' });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Promises = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      });
      try {
        const base64Strings = await Promise.all(base64Promises);
        onImageUpload(base64Strings);
      } catch (error) {
        console.error("Error converting files to base64", error);
      }
    }
  };
  
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          onVideoUpload(reader.result as string);
        }
      };
      reader.onerror = error => console.error("Error converting file to base64", error);
    } else {
        onVideoUpload('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Tell us about your business. This information will be used to generate your landing page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={control}
          name="companyInfo.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Innovations" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyInfo.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe what makes your business special..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="companyInfo.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="companyInfo.hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operation Hours</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mon-Fri, 9am - 5pm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>Products or Services</FormLabel>
          <div className="space-y-4 mt-2">
            {offeringFields.map((field, index) => (
              <Card key={field.id} className="bg-background">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <FormField
                      control={control}
                      name={`offerings.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder={`Product or Service #${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOffering(index)}
                      className="mt-8"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Offering</span>
                    </Button>
                  </div>

                   <FormField
                      control={control}
                      name={`offerings.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe this offering..." {...field} rows={3}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                  <FormField
                    control={control}
                    name={`offerings.${index}.image`}
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => {
                                  onChange(reader.result as string);
                                };
                              }
                            }} 
                            {...fieldProps}
                            className="text-sm"
                          />
                        </FormControl>
                        {value && (
                          <div className="relative w-24 h-24 mt-2">
                            <Image src={value} alt={`Offering image`} fill className="rounded-md object-cover" />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendOffering({ name: '', description: '', image: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Offering
            </Button>
          </div>
        </div>
        
        <div>
          <FormLabel>Social Media Links</FormLabel>
          <div className="space-y-2 mt-2">
            {socialFields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`companyInfo.socialLinks.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendSocial('')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
            </Button>
          </div>
        </div>

        <FormItem>
            <FormLabel>Business Images</FormLabel>
            <FormDescription>Upload images for your page gallery. The first image will be used as the cover image.</FormDescription>
            <FormControl>
                 <Input type="file" multiple onChange={handleFileChange} accept="image/*" />
            </FormControl>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                        <Image src={src} alt={`Uploaded image ${index+1}`} fill className="rounded-md object-cover"/>
                    </div>
                ))}
            </div>
            {galleryImages.length === 0 && (
                <div className="flex flex-col items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <ImageIcon className="w-10 h-10 mb-2"/>
                    <span>No images uploaded</span>
                </div>
            )}
        </FormItem>
        <FormItem>
            <FormLabel>Promotional Video</FormLabel>
            <FormDescription>Upload a short video for your page (optional).</FormDescription>
            <FormControl>
                 <Input type="file" onChange={handleVideoFileChange} accept="video/*" />
            </FormControl>
            <div className="mt-4">
                {promotionalVideo && (
                    <div className="relative aspect-video">
                        <video src={promotionalVideo} controls className="w-full rounded-md object-cover"/>
                    </div>
                )}
            </div>
             {promotionalVideo && (
                <Button type="button" variant="outline" size="sm" onClick={() => onVideoUpload('')} className="mt-2">
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Video
                </Button>
            )}
        </FormItem>
      </CardContent>
    </Card>
  );
}
