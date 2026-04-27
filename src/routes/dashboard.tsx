import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, User as UserIcon, Mail } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

function Dashboard() {
  const { user, profile, roles, isAdmin } = useAuth();

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {profile?.display_name ?? "friend"} 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Your personal dashboard — protected by JWT authentication.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.display_name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-muted-foreground">Roles:</span>
              {roles.map((r) => (
                <Badge key={r} variant={r === "admin" ? "default" : "secondary"}>
                  {r}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Access Level
            </CardTitle>
            <CardDescription>What you can do here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ View and manage your own posts</p>
            <p>✅ Update your profile</p>
            <p className={isAdmin ? "" : "text-muted-foreground line-through"}>
              {isAdmin ? "✅" : "🔒"} Manage all users (admin only)
            </p>
            <p className={isAdmin ? "" : "text-muted-foreground line-through"}>
              {isAdmin ? "✅" : "🔒"} Delete any post (admin only)
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link to="/posts">
              <Button>Manage your posts</Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline">Open admin panel</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
