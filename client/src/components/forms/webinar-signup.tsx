import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { webinarSignupSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { z } from "zod";

type WebinarSignupData = z.infer<typeof webinarSignupSchema>;

interface WebinarSignupProps {
  webinarId: string;
  webinarTitle: string;
  onSuccess?: () => void;
}

export default function WebinarSignup({ webinarId, webinarTitle, onSuccess }: WebinarSignupProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WebinarSignupData>({
    resolver: zodResolver(webinarSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      jobTitle: "",
      howHearAboutUs: "",
      webinarId,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: WebinarSignupData) => {
      await apiRequest("POST", "/api/webinar-signup", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: `You've been registered for "${webinarTitle}". Check your email for confirmation details.`,
      });
      
      // Invalidate webinar queries to update registration count
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars", webinarId] });
      
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: "There was an error registering for the webinar. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WebinarSignupData) => {
    signupMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-webinar-signup">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} data-testid="input-signup-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} data-testid="input-signup-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company/Organization</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} data-testid="input-signup-company" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Your job title" {...field} data-testid="input-signup-job-title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="howHearAboutUs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about us?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-how-hear">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="email">Email Newsletter</SelectItem>
                  <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                  <SelectItem value="search-engine">Search Engine</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={signupMutation.isPending}
          data-testid="button-submit-signup"
        >
          {signupMutation.isPending ? "Registering..." : "Register for Free"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By registering, you agree to receive webinar updates and related communications. 
          You can unsubscribe at any time.
        </p>
      </form>
    </Form>
  );
}
