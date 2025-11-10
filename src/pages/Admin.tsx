import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const queryClient = useQueryClient();
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    category_id: "",
    author: "",
    author_bio: "",
    author_image: "",
    content: "",
    featured_image: "",
    serial_number: "",
    status: "published"
  });

  const [relatedSearchForm, setRelatedSearchForm] = useState({
    blog_id: "",
    search_text: "",
    target_url: "",
    display_order: ""
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch all blogs
  const { data: blogs } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`*, categories(name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select(`
          *,
          blogs(title),
          related_searches(search_text)
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Calculate unique clicks
  const getUniqueClicks = (eventType: string, targetId?: string) => {
    if (!analytics) return { total: 0, unique: 0 };
    
    let filtered = analytics.filter(a => a.event_type === eventType);
    if (targetId) {
      filtered = filtered.filter(a => 
        a.related_search_id === targetId || a.blog_id === targetId
      );
    }
    
    const uniqueIps = new Set(filtered.map(a => a.ip_address));
    return {
      total: filtered.length,
      unique: uniqueIps.size
    };
  };

  // Create blog mutation
  const createBlog = useMutation({
    mutationFn: async (data: typeof blogForm) => {
      const { error } = await supabase.from("blogs").insert([{
        ...data,
        category_id: parseInt(data.category_id),
        serial_number: data.serial_number ? parseInt(data.serial_number) : null
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog created successfully!");
      setBlogForm({
        title: "",
        slug: "",
        category_id: "",
        author: "",
        author_bio: "",
        author_image: "",
        content: "",
        featured_image: "",
        serial_number: "",
        status: "published"
      });
    },
  });

  // Delete blog mutation
  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog deleted successfully!");
    },
  });

  // Create related search mutation
  const createRelatedSearch = useMutation({
    mutationFn: async (data: typeof relatedSearchForm) => {
      const { error } = await supabase.from("related_searches").insert([{
        blog_id: data.blog_id,
        search_text: data.search_text,
        target_url: data.target_url,
        display_order: parseInt(data.display_order) || 0
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Related search created successfully!");
      setRelatedSearchForm({
        blog_id: "",
        search_text: "",
        target_url: "",
        display_order: ""
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Panel - DramaOrbitZone</h1>

        <Tabs defaultValue="blogs">
          <TabsList>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="related">Related Searches</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
              <div className="grid gap-4">
                <Input
                  placeholder="Title"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                />
                <Input
                  placeholder="Slug (e.g., my-blog-post)"
                  value={blogForm.slug}
                  onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                />
                <Input
                  placeholder="Serial Number"
                  type="number"
                  value={blogForm.serial_number}
                  onChange={(e) => setBlogForm({ ...blogForm, serial_number: e.target.value })}
                />
                <Select
                  value={blogForm.category_id}
                  onValueChange={(value) => setBlogForm({ ...blogForm, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Author"
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                />
                <Textarea
                  placeholder="Author Bio"
                  value={blogForm.author_bio}
                  onChange={(e) => setBlogForm({ ...blogForm, author_bio: e.target.value })}
                />
                <Input
                  placeholder="Author Image URL"
                  value={blogForm.author_image}
                  onChange={(e) => setBlogForm({ ...blogForm, author_image: e.target.value })}
                />
                <Input
                  placeholder="Featured Image URL"
                  value={blogForm.featured_image}
                  onChange={(e) => setBlogForm({ ...blogForm, featured_image: e.target.value })}
                />
                <Textarea
                  placeholder="Content (HTML supported)"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  rows={10}
                />
                <Button onClick={() => createBlog.mutate(blogForm)}>
                  Create Blog
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">All Blogs</h2>
              <div className="space-y-4">
                {blogs?.map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <h3 className="font-semibold">{blog.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {blog.categories?.name} • Serial: {blog.serial_number || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/blog/${blog.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBlog.mutate(blog.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Add Related Search</h2>
              <div className="grid gap-4">
                <Select
                  value={relatedSearchForm.blog_id}
                  onValueChange={(value) => setRelatedSearchForm({ ...relatedSearchForm, blog_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blog" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogs?.map((blog) => (
                      <SelectItem key={blog.id} value={blog.id}>
                        {blog.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search Text"
                  value={relatedSearchForm.search_text}
                  onChange={(e) => setRelatedSearchForm({ ...relatedSearchForm, search_text: e.target.value })}
                />
                <Input
                  placeholder="Target URL"
                  value={relatedSearchForm.target_url}
                  onChange={(e) => setRelatedSearchForm({ ...relatedSearchForm, target_url: e.target.value })}
                />
                <Input
                  placeholder="Display Order"
                  type="number"
                  value={relatedSearchForm.display_order}
                  onChange={(e) => setRelatedSearchForm({ ...relatedSearchForm, display_order: e.target.value })}
                />
                <Button onClick={() => createRelatedSearch.mutate(relatedSearchForm)}>
                  Add Related Search
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Blog Views</h3>
                <p className="text-3xl font-bold">{getUniqueClicks("blog_view").total}</p>
                <p className="text-sm text-muted-foreground">
                  {getUniqueClicks("blog_view").unique} unique
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Related Search Clicks</h3>
                <p className="text-3xl font-bold">{getUniqueClicks("related_search_click").total}</p>
                <p className="text-sm text-muted-foreground">
                  {getUniqueClicks("related_search_click").unique} unique
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Visit Now Clicks</h3>
                <p className="text-3xl font-bold">{getUniqueClicks("visit_now_click").total}</p>
                <p className="text-sm text-muted-foreground">
                  {getUniqueClicks("visit_now_click").unique} unique
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-2">
                {analytics?.slice(0, 20).map((event) => (
                  <div key={event.id} className="p-3 border rounded text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{event.event_type}</span>
                      <span className="text-muted-foreground">
                        {format(new Date(event.created_at), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.blogs?.title || event.related_searches?.search_text}
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>IP: {event.ip_address}</span>
                      <span>Device: {event.device}</span>
                      <span>Country: {event.country}</span>
                      <span>Source: {event.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
