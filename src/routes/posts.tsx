import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Edit2, X, Check } from "lucide-react";

export const Route = createFileRoute("/posts")({
  component: () => (
    <ProtectedRoute>
      <PostsPage />
    </ProtectedRoute>
  ),
});

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

const postSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  content: z.string().trim().min(1, "Content required").max(2000),
});

function PostsPage() {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const parsed = postSchema.safeParse({
      title: form.get("title"),
      content: form.get("content"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("posts")
      .insert({ ...parsed.data, user_id: user.id });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Post created");
      e.currentTarget.reset();
      void fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Post deleted");
      void fetchPosts();
    }
  };

  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditContent(p.content);
  };

  const handleUpdate = async (id: string) => {
    const parsed = postSchema.safeParse({ title: editTitle, content: editContent });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    const { error } = await supabase.from("posts").update(parsed.data).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Post updated");
      setEditingId(null);
      void fetchPosts();
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <p className="mt-1 text-muted-foreground">
          {isAdmin
            ? "You can delete any post (admin)."
            : "You can edit and delete only your own posts."}
        </p>
      </div>

      <Card className="mb-8 shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            New post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" required maxLength={2000} rows={4} />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts yet. Create the first one!</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => {
            const isOwner = p.user_id === user?.id;
            const canEdit = isOwner;
            const canDelete = isOwner || isAdmin;
            const isEditing = editingId === p.id;

            return (
              <Card key={p.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        maxLength={200}
                      />
                    ) : (
                      <CardTitle className="text-lg">{p.title}</CardTitle>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <Badge variant={isOwner ? "default" : "secondary"}>
                        {isOwner ? "You" : "Other user"}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {canEdit && !isEditing && (
                      <Button size="icon" variant="ghost" onClick={() => startEdit(p)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {isEditing && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => handleUpdate(p.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {canDelete && !isEditing && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      maxLength={2000}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">{p.content}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
