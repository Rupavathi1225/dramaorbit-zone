import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export const RecentPosts = () => {
  const { data: posts } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          categories (name, slug)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  if (!posts || posts.length === 0) return null;

  return (
    <div className="bg-card rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Recent posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.categories?.slug}/${post.slug}`}
            className="flex gap-3 group"
          >
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                {post.categories?.name} • {format(new Date(post.published_at), "MMM dd, yyyy")}
              </div>
              <h4 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="text-xs text-muted-foreground mt-1">
                By {post.author}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
