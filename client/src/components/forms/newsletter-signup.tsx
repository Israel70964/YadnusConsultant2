import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { newsletterSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { z } from "zod";

type NewsletterData = z.infer<typeof newsletterSchema>;

export default function NewsletterSignup() {
  const { toast } = useToast();

  const form = useForm<NewsletterData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const newsletterMutation = useMutation({
    mutationFn: async (data: NewsletterData) => {
      await apiRequest("POST", "/api/newsletter", data);
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterData) => {
    newsletterMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" data-testid="form-newsletter">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-background/10 border border-background/20 text-foreground placeholder-muted-foreground" 
                  {...field} 
                  data-testid="input-newsletter-email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={newsletterMutation.isPending}
          data-testid="button-subscribe-newsletter"
        >
          {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </Form>
  );
}
