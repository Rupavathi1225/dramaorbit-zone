import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function HomePage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["all-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          categories (name, slug)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">DramaOrbitZone</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your digital hub for embracing a vibrant and wholesome lifestyle. We're dedicated to inspiring and guiding you on the path to optimal well-being.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.categories?.slug}/${post.slug}`}
                className="group"
              >
                <article className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="bg-secondary px-2 py-1 rounded text-xs">
                        {post.categories?.name}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(post.published_at), "MMM dd, yyyy")}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">By {post.author}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
