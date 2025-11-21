import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { trackEvent } from "@/lib/tracking";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type PrelandingPage = Database['public']['Tables']['prelanding_pages']['Row'];

export const PreLandingPage = () => {
  const { searchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const { data: config, isLoading } = useQuery({
    queryKey: ["prelanding-config", searchId],
    queryFn: async () => {
      const { data: searchData, error: searchError } = await supabase
        .from("related_searches")
        .select("*")
        .eq("id", searchId)
        .single();

      if (searchError) throw searchError;

      const { data: configData } = await supabase
        .from("prelanding_pages")
        .select("*")
        .eq("related_search_id", searchId)
        .single();

      return { search: searchData, config: configData };
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Save email to database
    const { error: emailError } = await supabase
      .from("prelanding_emails")
      .insert({
        email,
        related_search_id: searchId,
      });

    if (emailError) {
      console.error("Error saving email:", emailError);
      toast({
        title: "Error",
        description: "Failed to save email. Please try again.",
        variant: "destructive",
      });
      return;
    }

    await trackEvent("prelanding_email_submit", undefined, searchId);
    
    // Track visit now click
    await trackEvent("visit_now_click", undefined, searchId);
    
    // Show success message
    toast({
      title: "Success!",
      description: "Your email has been submitted.",
    });

    // Redirect to target URL
    if (config?.search?.target_url) {
      window.open(config.search.target_url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const cfg: Partial<PrelandingPage> = config?.config || {};
  const logoPosition = cfg.logo_position === 'top-left' ? 'items-start' : 'items-center';
  const imageRatio = cfg.image_ratio === '16:9' ? 'aspect-video' : 'aspect-square';

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: cfg.background_color || '#ffffff',
        backgroundImage: cfg.background_image_url ? `url(${cfg.background_image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Logo */}
      {cfg.logo_url && (
        <div className={`flex ${logoPosition} p-6`}>
          <img 
            src={cfg.logo_url} 
            alt="Logo" 
            style={{ width: `${cfg.logo_size || 100}px` }}
            className="object-contain"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Main Image */}
          {cfg.main_image_url && (
            <div className={`w-full ${imageRatio} overflow-hidden rounded-lg`}>
              <img 
                src={cfg.main_image_url} 
                alt="Featured" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Headline and Description */}
          <div 
            className="space-y-4"
            style={{ textAlign: (cfg.text_alignment || 'center') as 'left' | 'center' | 'right' }}
          >
            <h1 
              style={{
                fontSize: `${cfg.headline_font_size || 32}px`,
                color: cfg.headline_color || '#000000',
                fontWeight: 'bold',
              }}
            >
              {cfg.headline || 'Welcome'}
            </h1>
            <p 
              style={{
                fontSize: `${cfg.description_font_size || 16}px`,
                color: cfg.description_color || '#666666',
              }}
            >
              {cfg.description || 'Check out this amazing resource'}
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border-2 outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: cfg.email_box_color || '#ffffff',
                borderColor: cfg.email_box_border_color || '#cccccc',
              }}
            />
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: cfg.button_color || '#1a2942',
                color: cfg.button_text_color || '#ffffff',
              }}
            >
              {cfg.button_text || 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
