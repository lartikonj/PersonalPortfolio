import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [siteName, setSiteName] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    onSuccess: (data) => {
      const siteNameSetting = data?.find((s: any) => s.key === "site_name");
      if (siteNameSetting) {
        setSiteName(siteNameSetting.value);
      }
    },
  });

  const updateSiteName = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/settings", {
        key: "site_name",
        value: name,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Site name has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update site name",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteName.mutate(siteName);
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
        <form onSubmit={handleSave} className="space-y-4">
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
              This will appear as the main title in the navigation bar
            </p>
          </div>
          <Button
            type="submit"
            disabled={updateSiteName.isPending}
            className="w-full"
          >
            {updateSiteName.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}