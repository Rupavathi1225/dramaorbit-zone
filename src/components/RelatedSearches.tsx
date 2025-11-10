import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/tracking";

interface RelatedSearchesProps {
  blogId: string;
}

export const RelatedSearches = ({ blogId }: RelatedSearchesProps) => {
  const navigate = useNavigate();
  
  const { data: searches } = useQuery({
    queryKey: ["related-searches", blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("related_searches")
        .select("*")
        .eq("blog_id", blogId)
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  const handleSearchClick = async (search: any) => {
    await trackEvent("related_search_click", blogId, search.id);
    navigate(`/search/${search.id}`);
  };

  if (!searches || searches.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="text-sm text-muted-foreground mb-4">Related searches</h3>
      <div className="space-y-3">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => handleSearchClick(search)}
            className="w-full bg-[hsl(var(--navy-dark))] text-white p-4 rounded-lg flex items-center justify-between hover:bg-[hsl(var(--navy-light))] transition-colors group"
          >
            <span className="font-medium">{search.search_text}</span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
