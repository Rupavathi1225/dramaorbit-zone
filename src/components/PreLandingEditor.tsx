import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const PreLandingEditor = () => {
  const queryClient = useQueryClient();
  const [selectedSearchId, setSelectedSearchId] = useState("");
  
  const [config, setConfig] = useState({
    logo_url: "",
    logo_position: "top-center",
    logo_size: "100",
    main_image_url: "",
    image_ratio: "16:9",
    headline: "Welcome",
    description: "Check out this amazing resource",
    headline_font_size: "32",
    headline_color: "#000000",
    description_font_size: "16",
    description_color: "#666666",
    text_alignment: "center",
    email_box_color: "#ffffff",
    email_box_border_color: "#cccccc",
    button_text: "Continue",
    button_color: "#1a2942",
    button_text_color: "#ffffff",
    background_color: "#ffffff",
    background_image_url: "",
  });

  // Fetch all related searches
  const { data: searches } = useQuery({
    queryKey: ["all-searches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("related_searches")
        .select("*, blogs(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch existing prelanding config for selected search
  const { data: existingConfig } = useQuery({
    queryKey: ["prelanding-config", selectedSearchId],
    queryFn: async () => {
      if (!selectedSearchId) return null;
      const { data } = await supabase
        .from("prelanding_pages")
        .select("*")
        .eq("related_search_id", selectedSearchId)
        .single();
      return data;
    },
    enabled: !!selectedSearchId,
  });

  // Load existing config when selected
  useState(() => {
    if (existingConfig) {
      setConfig({
        logo_url: existingConfig.logo_url || "",
        logo_position: existingConfig.logo_position || "top-center",
        logo_size: String(existingConfig.logo_size || 100),
        main_image_url: existingConfig.main_image_url || "",
        image_ratio: existingConfig.image_ratio || "16:9",
        headline: existingConfig.headline || "Welcome",
        description: existingConfig.description || "Check out this amazing resource",
        headline_font_size: String(existingConfig.headline_font_size || 32),
        headline_color: existingConfig.headline_color || "#000000",
        description_font_size: String(existingConfig.description_font_size || 16),
        description_color: existingConfig.description_color || "#666666",
        text_alignment: existingConfig.text_alignment || "center",
        email_box_color: existingConfig.email_box_color || "#ffffff",
        email_box_border_color: existingConfig.email_box_border_color || "#cccccc",
        button_text: existingConfig.button_text || "Continue",
        button_color: existingConfig.button_color || "#1a2942",
        button_text_color: existingConfig.button_text_color || "#ffffff",
        background_color: existingConfig.background_color || "#ffffff",
        background_image_url: existingConfig.background_image_url || "",
      });
    }
  });

  // Save prelanding page mutation
  const savePrelanding = useMutation({
    mutationFn: async () => {
      if (!selectedSearchId) throw new Error("Please select a related search");

      const payload = {
        related_search_id: selectedSearchId,
        logo_url: config.logo_url || null,
        logo_position: config.logo_position,
        logo_size: parseInt(config.logo_size),
        main_image_url: config.main_image_url || null,
        image_ratio: config.image_ratio,
        headline: config.headline,
        description: config.description,
        headline_font_size: parseInt(config.headline_font_size),
        headline_color: config.headline_color,
        description_font_size: parseInt(config.description_font_size),
        description_color: config.description_color,
        text_alignment: config.text_alignment,
        email_box_color: config.email_box_color,
        email_box_border_color: config.email_box_border_color,
        button_text: config.button_text,
        button_color: config.button_color,
        button_text_color: config.button_text_color,
        background_color: config.background_color,
        background_image_url: config.background_image_url || null,
      };

      if (existingConfig) {
        const { error } = await supabase
          .from("prelanding_pages")
          .update(payload)
          .eq("id", existingConfig.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("prelanding_pages")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prelanding-config"] });
      toast.success("Pre-landing page saved successfully!");
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Configure Pre-Landing Page</h2>
      
      <div className="space-y-6">
        {/* Select Related Search */}
        <div>
          <label className="text-sm font-medium mb-2 block">Select Related Search</label>
          <Select value={selectedSearchId} onValueChange={setSelectedSearchId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a related search" />
            </SelectTrigger>
            <SelectContent>
              {searches?.map((search) => (
                <SelectItem key={search.id} value={search.id}>
                  {search.search_text} ({search.blogs?.title})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSearchId && (
          <>
            {/* Logo Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Logo Settings</h3>
              <Input
                placeholder="Logo URL"
                value={config.logo_url}
                onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={config.logo_position}
                  onValueChange={(value) => setConfig({ ...config, logo_position: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Logo Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Logo Size (px)"
                  type="number"
                  value={config.logo_size}
                  onChange={(e) => setConfig({ ...config, logo_size: e.target.value })}
                />
              </div>
            </div>

            {/* Main Image Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Main Image Settings</h3>
              <Input
                placeholder="Main Image URL"
                value={config.main_image_url}
                onChange={(e) => setConfig({ ...config, main_image_url: e.target.value })}
              />
              <Select
                value={config.image_ratio}
                onValueChange={(value) => setConfig({ ...config, image_ratio: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Image Ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Text Settings</h3>
              <Input
                placeholder="Headline"
                value={config.headline}
                onChange={(e) => setConfig({ ...config, headline: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Headline Font Size"
                  type="number"
                  value={config.headline_font_size}
                  onChange={(e) => setConfig({ ...config, headline_font_size: e.target.value })}
                />
                <Input
                  placeholder="Headline Color"
                  type="color"
                  value={config.headline_color}
                  onChange={(e) => setConfig({ ...config, headline_color: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Description"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Description Font Size"
                  type="number"
                  value={config.description_font_size}
                  onChange={(e) => setConfig({ ...config, description_font_size: e.target.value })}
                />
                <Input
                  placeholder="Description Color"
                  type="color"
                  value={config.description_color}
                  onChange={(e) => setConfig({ ...config, description_color: e.target.value })}
                />
              </div>
              <Select
                value={config.text_alignment}
                onValueChange={(value) => setConfig({ ...config, text_alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Text Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Form Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Email Form Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Email Box Color"
                  type="color"
                  value={config.email_box_color}
                  onChange={(e) => setConfig({ ...config, email_box_color: e.target.value })}
                />
                <Input
                  placeholder="Email Box Border Color"
                  type="color"
                  value={config.email_box_border_color}
                  onChange={(e) => setConfig({ ...config, email_box_border_color: e.target.value })}
                />
              </div>
            </div>

            {/* Button Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Button Settings</h3>
              <Input
                placeholder="Button Text"
                value={config.button_text}
                onChange={(e) => setConfig({ ...config, button_text: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Button Background Color"
                  type="color"
                  value={config.button_color}
                  onChange={(e) => setConfig({ ...config, button_color: e.target.value })}
                />
                <Input
                  placeholder="Button Text Color"
                  type="color"
                  value={config.button_text_color}
                  onChange={(e) => setConfig({ ...config, button_text_color: e.target.value })}
                />
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Background Settings</h3>
              <Input
                placeholder="Background Color"
                type="color"
                value={config.background_color}
                onChange={(e) => setConfig({ ...config, background_color: e.target.value })}
              />
              <Input
                placeholder="Background Image URL (optional)"
                value={config.background_image_url}
                onChange={(e) => setConfig({ ...config, background_image_url: e.target.value })}
              />
            </div>

            <Button 
              onClick={() => savePrelanding.mutate()} 
              className="w-full"
              disabled={savePrelanding.isPending}
            >
              {savePrelanding.isPending ? "Saving..." : "Save Pre-Landing Page"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
