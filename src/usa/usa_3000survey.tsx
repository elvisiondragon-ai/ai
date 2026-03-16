import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { initFacebookPixelWithLogging } from '@/utils/fbpixel';

export default function Survey3000() {
  const { toast } = useToast();

  useEffect(() => {
    // Facebook Pixel Code
    const pixelId = '1393383179182528';
    initFacebookPixelWithLogging(pixelId);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question1: '',
    question1Other: '',
    question2: '',
    question2Other: '',
    question3: '',
    instagram: '',
    whatsapp: '',
    email: '',
    name: '',
    urgencyLevel: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare final answers (handling "Other" fields)
    const finalQuestion1 = formData.question1 === 'Something else' 
      ? `Something else: ${formData.question1Other}` 
      : formData.question1;

    const finalQuestion2 = formData.question2 === 'Other' 
      ? `Other: ${formData.question2Other}` 
      : formData.question2;

    const payload = {
      question1: finalQuestion1,
      question2: finalQuestion2,
      question3: formData.question3,
      instagram: formData.instagram,
      whatsapp: formData.whatsapp,
      email: formData.email,
      name: formData.name,
      urgency_level: parseInt(formData.urgencyLevel) || 0
    };

    try {
      // 1. Store in Supabase
      const { error } = await supabase
        .from('survey3000')
        .insert([payload as any]);

      if (error) throw error;

      toast({
        title: "Survey Submitted",
        description: "Redirecting you to WhatsApp...",
      });

      // 2. Redirect to WhatsApp
      const message = `*New VIP 1:1 Application*\n\n` +
        `*Name:* ${payload.name}\n` +
        `*Email:* ${payload.email}\n` +
        `*WhatsApp:* ${payload.whatsapp}\n` +
        `*Instagram:* ${payload.instagram}\n\n` +
        `*1. Where stuck:* ${payload.question1}\n` +
        `*2. Main Interest:* ${payload.question2}\n` +
        `*3. Investment Readiness:* ${payload.question3}\n` +
        `*4. Urgency (1-10):* ${payload.urgency_level}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/62895325633487?text=${encodedMessage}`;

      // Small delay to let the toast show
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 1000);

    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit survey. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            VIP 1:1 Session Application
          </h1>
          <p className="mt-4 text-gray-400">
            Please answer honestly. This helps us understand if we are the right fit for your transformation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
          
          {/* Question 1 */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-yellow-500">
              1. Where do you feel most stuck, even after trying to improve consciously? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup 
              value={formData.question1} 
              onValueChange={(val) => handleValueChange('question1', val)}
              className="space-y-3"
              required
            >
              {[
                "Relationships repeating the same patterns",
                "Money or career plateau",
                "Health, energy, or stress levels",
                "Constant mental noise despite “success”",
                "Something else"
              ].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`q1-${option}`} className="border-gray-600 text-yellow-500" />
                  <Label htmlFor={`q1-${option}`} className="text-gray-300 cursor-pointer font-normal">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {formData.question1 === 'Something else' && (
              <Textarea 
                name="question1Other"
                placeholder="Please explain..."
                value={formData.question1Other}
                onChange={handleInputChange}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
                required
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-yellow-500">
              2. What is the main reason you are interested in this VIP session to recalibrate your subconscious? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup 
              value={formData.question2} 
              onValueChange={(val) => handleValueChange('question2', val)}
              className="space-y-3"
              required
            >
              {[
                "Improving relationships",
                "Increasing income or financial clarity",
                "Health, energy, and longevity",
                "Happiness, peace of mind, and emotional balance",
                "Other"
              ].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`q2-${option}`} className="border-gray-600 text-yellow-500" />
                  <Label htmlFor={`q2-${option}`} className="text-gray-300 cursor-pointer font-normal">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {formData.question2 === 'Other' && (
              <Input 
                name="question2Other"
                placeholder="Please specify..."
                value={formData.question2Other}
                onChange={handleInputChange}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
                required
              />
            )}
          </div>

          {/* Question 3 */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-yellow-500">
              3. Are you prepared to invest a minimum of $3,000 for 6 weeks in a premium, results-driven process? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup 
              value={formData.question3} 
              onValueChange={(val) => handleValueChange('question3', val)}
              className="space-y-3"
              required
            >
              {[
                "Yes, I only pursue services where the potential for a massive ROI justifies a premium fee.",
                "Yes, I am serious about transformation and ready to invest in the right solution",
                "I would need to see the value first.",
                "I wanted to but my budget for personal development is capped under $1,000."
              ].map((option) => (
                <div key={option} className="flex items-start space-x-3">
                  <RadioGroupItem value={option} id={`q3-${option}`} className="mt-1 border-gray-600 text-yellow-500" />
                  <Label htmlFor={`q3-${option}`} className="text-gray-300 cursor-pointer font-normal leading-relaxed">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 pt-4 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-400">Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-400">Email <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-gray-400">WhatsApp Number <span className="text-red-500">*</span></Label>
                <Input id="whatsapp" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleInputChange} required className="bg-gray-800 border-gray-700" placeholder="+CountryCode (e.g. +62812...)" />
                <p className="text-[10px] text-gray-500">Please include your country code starting with +</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-gray-400">Instagram Handle</Label>
                <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} className="bg-gray-800 border-gray-700" placeholder="@username" />
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-4">
            <Label htmlFor="urgency" className="text-lg font-semibold text-yellow-500">
              On a scale of 1–10, how urgent is this for you right now? <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.urgencyLevel} 
              onValueChange={(val: any) => handleValueChange('urgencyLevel', val)} 
              required
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-6 text-lg rounded-xl transition-all transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

        </form>
      </div>
    </div>
  );
}
