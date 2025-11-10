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
import { Trash2, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";

// Session Row Component with expandable details
const SessionRow = ({ session }: { session: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get unique related searches with their details
  const relatedSearchesMap = new Map();
  session.events.forEach((event: any) => {
    if (event.event_type === 'related_search_click' && event.related_searches) {
      const key = event.related_searches.search_text;
      if (!relatedSearchesMap.has(key)) {
        relatedSearchesMap.set(key, {
          text: event.related_searches.search_text,
          total: 0,
          visitNowClicked: false
        });
      }
      relatedSearchesMap.get(key).total++;
    }
    if (event.event_type === 'visit_now_click') {
      // Mark visit now as clicked for the related search
      relatedSearchesMap.forEach((value) => {
        value.visitNowClicked = true;
      });
    }
  });
  
  const relatedSearches = Array.from(relatedSearchesMap.values());
  
  // Get unique blog clicks
  const blogClicksMap = new Map();
  session.events.forEach((event: any) => {
    if (event.event_type === 'blog_view' && event.blogs) {
      const key = event.blogs.title;
      if (!blogClicksMap.has(key)) {
        blogClicksMap.set(key, {
          title: event.blogs.title,
          total: 0
        });
      }
      blogClicksMap.get(key).total++;
    }
  });
  
  const blogClicks = Array.from(blogClicksMap.values());
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-10 gap-2 p-3 items-center text-sm hover:bg-gray-50">
        <div className="col-span-1 truncate font-mono text-xs">
          {session.session_id.slice(0, 11)}...
        </div>
        <div className="col-span-1 text-xs">{session.ip_address}</div>
        <div className="col-span-1">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            {session.country}
          </span>
        </div>
        <div className="col-span-1">
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            {session.source}
          </span>
        </div>
        <div className="col-span-1 flex items-center gap-1 text-xs">
          <span>💻</span> {session.device}
        </div>
        <div className="col-span-1 text-center font-semibold">{session.page_views}</div>
        <div className="col-span-1 text-center font-semibold">{session.total_clicks}</div>
        
        {/* Related Searches Column */}
        <div className="col-span-1">
          {relatedSearches.length > 0 ? (
            <div className="bg-green-50 border border-green-200 px-2 py-1 rounded">
              <div className="text-xs font-semibold text-green-800">Total: {relatedSearches.length}</div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                View breakdown
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-xs">Total: 0</div>
          )}
        </div>
        
        {/* Blog Clicks Column */}
        <div className="col-span-1">
          {blogClicks.length > 0 ? (
            <div className="bg-orange-50 border border-orange-200 px-2 py-1 rounded">
              <div className="text-xs font-semibold text-orange-800">Total: {blogClicks.length}</div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                View breakdown
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-xs">Total: 0</div>
          )}
        </div>
        
        <div className="col-span-1 text-xs text-gray-600">
          {format(new Date(session.last_active), "M/d/yyyy, h:mm:ss a")}
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Related Searches Breakdown */}
            {relatedSearches.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-sm text-gray-700">Related Searches Details</h4>
                <div className="space-y-2">
                  {relatedSearches.map((search, idx) => (
                    <div key={idx} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                      <div className="font-medium text-sm mb-2">{search.text}</div>
                      <div className="flex gap-4 text-xs text-gray-600 mb-2">
                        <span className="bg-blue-50 px-2 py-1 rounded">
                          <span className="font-semibold">Total:</span> {search.total}
                        </span>
                        <span className="bg-purple-50 px-2 py-1 rounded">
                          <span className="font-semibold">Unique:</span> 1
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className={search.visitNowClicked ? "text-green-600 font-medium" : "text-red-600"}>
                          Visit Now Button: {search.visitNowClicked ? "Clicked ✓" : "Not Clicked"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Blog Clicks Breakdown */}
            {blogClicks.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-sm text-gray-700">Blog Clicks Details</h4>
                <div className="space-y-2">
                  {blogClicks.map((blog, idx) => (
                    <div key={idx} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                      <div className="font-medium text-sm mb-2">{blog.title}</div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span className="bg-blue-50 px-2 py-1 rounded">
                          <span className="font-semibold">Total:</span> {blog.total}
                        </span>
                        <span className="bg-purple-50 px-2 py-1 rounded">
                          <span className="font-semibold">Unique:</span> 1
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const [countryFilter, setCountryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

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

  // Fetch analytics grouped by session
  const { data: sessions } = useQuery({
    queryKey: ["analytics-sessions", countryFilter, sourceFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select(`
          *,
          blogs(title, slug),
          related_searches(search_text, target_url)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Group by session_id
      const sessionMap = new Map();
      
      data.forEach((event: any) => {
        // Apply filters
        if (countryFilter !== "all" && event.country !== countryFilter) return;
        if (sourceFilter !== "all" && event.source !== sourceFilter) return;
        
        if (!sessionMap.has(event.session_id)) {
          sessionMap.set(event.session_id, {
            session_id: event.session_id,
            ip_address: event.ip_address,
            country: event.country,
            source: event.source,
            device: event.device,
            last_active: event.created_at,
            page_views: 0,
            total_clicks: 0,
            events: []
          });
        }
        
        const session = sessionMap.get(event.session_id);
        session.events.push(event);
        
        if (event.event_type === 'blog_view') {
          session.page_views++;
        } else if (event.event_type === 'related_search_click' || event.event_type === 'visit_now_click') {
          session.total_clicks++;
        }
        
        // Update last active
        if (new Date(event.created_at) > new Date(session.last_active)) {
          session.last_active = event.created_at;
        }
      });
      
      return Array.from(sessionMap.values());
    },
  });

  // Get unique countries and sources for filters
  const { data: filterOptions } = useQuery({
    queryKey: ["filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("country, source");
      
      if (error) throw error;
      
      const countries = [...new Set(data.map((d: any) => d.country).filter(Boolean))];
      const sources = [...new Set(data.map((d: any) => d.source).filter(Boolean))];
      
      return { countries, sources };
    },
  });

  // Calculate totals
  const totalSessions = sessions?.length || 0;
  const totalPageViews = sessions?.reduce((sum, s) => sum + s.page_views, 0) || 0;
  const totalClicks = sessions?.reduce((sum, s) => sum + s.total_clicks, 0) || 0;

  // Count unique IPs for unique visitors
  const uniqueVisitors = sessions ? new Set(sessions.map(s => s.ip_address)).size : 0;

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
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <h3 className="font-semibold mb-2 text-gray-700">Total Sessions</h3>
                <p className="text-4xl font-bold text-orange-600">{totalSessions}</p>
                <p className="text-sm text-gray-600 mt-1">Unique visitors tracked</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <h3 className="font-semibold mb-2 text-gray-700">Page Views</h3>
                <p className="text-4xl font-bold text-blue-600">{totalPageViews}</p>
                <p className="text-sm text-gray-600 mt-1">Total pages viewed</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <h3 className="font-semibold mb-2 text-gray-700">Total Clicks</h3>
                <p className="text-4xl font-bold text-green-600">{totalClicks}</p>
                <p className="text-sm text-gray-600 mt-1">Buttons and links clicked</p>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Filters</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Country</label>
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {filterOptions?.countries.map((country: string) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Source</label>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {filterOptions?.sources.map((source: string) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Sessions Table */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Session Details</h3>
              
              {/* Table Header */}
              <div className="grid grid-cols-10 gap-2 p-3 font-semibold text-sm border-b-2 border-gray-300 bg-gray-100">
                <div className="col-span-1">Session ID</div>
                <div className="col-span-1">IP Address</div>
                <div className="col-span-1">Country</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-1">Device</div>
                <div className="col-span-1 text-center">Page Views</div>
                <div className="col-span-1 text-center">Clicks</div>
                <div className="col-span-1">Related Searches</div>
                <div className="col-span-1">Blog Clicks</div>
                <div className="col-span-1">Last Active</div>
              </div>
              
              {/* Table Body */}
              <div className="space-y-2 mt-2">
                {sessions && sessions.length > 0 ? (
                  sessions.map((session) => (
                    <SessionRow key={session.session_id} session={session} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No analytics data available
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}