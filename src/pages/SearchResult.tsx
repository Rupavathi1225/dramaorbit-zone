import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RecentPosts } from "@/components/RecentPosts";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

export default function SearchResult() {
  const { searchId } = useParams<{ searchId: string }>();
  const navigate = useNavigate();

  const { data: search } = useQuery({
    queryKey: ["search-result", searchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("related_searches")
        .select("*")
        .eq("id", searchId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleVisitNow = async () => {
    // Redirect to pre-landing page instead of direct URL
    navigate(`/prelanding/${searchId}`);
  };

  if (!search) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {search.search_text}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            You're about to visit an external resource. Click the button below to continue.
          </p>

          <Button
            onClick={handleVisitNow}
            size="lg"
            className="bg-[hsl(var(--navy-dark))] hover:bg-[hsl(var(--navy-light))] text-white"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Visit Now
          </Button>

          <div className="mt-12">
            <RecentPosts />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
