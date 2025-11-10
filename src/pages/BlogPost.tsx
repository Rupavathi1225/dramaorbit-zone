import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RecentPosts } from "@/components/RecentPosts";
import { RelatedSearches } from "@/components/RelatedSearches";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

export default function BlogPost() {
  const { categorySlug, slug } = useParams<{ categorySlug: string; slug: string }>();

  const { data: post } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          categories (name, slug)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post?.id) {
      trackEvent("blog_view", post.id);
    }
  }, [post?.id]);

  if (!post) {
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Left */}
            <aside className="lg:w-80 order-2 lg:order-1">
              {post.author && (
                <div className="bg-card rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    {post.author_image && (
                      <img
                        src={post.author_image}
                        alt={post.author}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold">{post.author}</h3>
                    </div>
                  </div>
                  {post.author_bio && (
                    <p className="text-sm text-muted-foreground">{post.author_bio}</p>
                  )}
                </div>
              )}

              <RecentPosts />
            </aside>

            {/* Main Content */}
            <article className="flex-1 order-1 lg:order-2">
              <div className="mb-4">
                <span className="bg-secondary px-3 py-1 rounded text-sm">
                  {post.categories?.name}
                </span>
                <span className="mx-2">•</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(post.published_at), "MMM dd, yyyy")}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto rounded-lg mb-8"
                />
              )}

              <div
                className="blog-content prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <RelatedSearches blogId={post.id} />
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
