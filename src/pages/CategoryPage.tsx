import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["category-posts", category?.id],
    queryFn: async () => {
      if (!category) return [];
      
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          categories (name, slug)
        `)
        .eq("category_id", category.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{category?.name}</h1>

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
      </main>

      <Footer />
    </div>
  );
}
