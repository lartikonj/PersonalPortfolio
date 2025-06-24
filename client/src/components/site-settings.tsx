import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [siteName, setSiteName] = useState("");
  const [heroTagline, setHeroTagline] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    onSuccess: (data) => {
      const siteNameSetting = data?.find((s: any) => s.key === "site_name");
      const heroTaglineSetting = data?.find((s: any) => s.key === "hero_tagline");
      if (siteNameSetting) {
        setSiteName(siteNameSetting.value);
      }
      if (heroTaglineSetting) {
        setHeroTagline(heroTaglineSetting.value);
      }
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (settings: { siteName: string; heroTagline: string }) => {
      const promises = [
        apiRequest("POST", "/api/settings", {
          key: "site_name",
          value: settings.siteName,
        }),
        apiRequest("POST", "/api/settings", {
          key: "hero_tagline",
          value: settings.heroTagline,
        })
      ];
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Site settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ siteName, heroTagline });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Customize your portfolio appearance and branding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter your name or site title"
              className="mt-1"
            />
            <p className="text-sm text-slate-500 mt-1">
              This will appear as the main title in the navigation bar and hero section
            </p>
          </div>
          
          <div>
            <Label htmlFor="heroTagline">Hero Section Tagline</Label>
            <Textarea
              id="heroTagline"
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              placeholder="Full Stack Developer & UI/UX Designer passionate about creating beautiful, functional web experiences"
              className="mt-1"
              rows={3}
            />
            <p className="text-sm text-slate-500 mt-1">
              This descriptive text appears below your name in the hero section
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={updateSettings.isPending}
            className="w-full"
          >
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}