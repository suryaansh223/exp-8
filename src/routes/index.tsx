import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Users, Database, Key, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container relative mx-auto px-4 py-20 sm:py-32 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm backdrop-blur">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">JWT • RBAC • Protected Routes</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Full Stack Auth,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              Done Right.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A secure authentication system with JWT tokens, role-based access control,
            and protected routes — built end-to-end.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="shadow-[var(--shadow-elegant)]">
                Create account
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Key,
              title: "JWT Authentication",
              desc: "Secure token-based auth with auto-refresh and persistent sessions.",
            },
            {
              icon: Users,
              title: "Role-Based Access",
              desc: "Admin and User roles enforced at the database level with RLS.",
            },
            {
              icon: Lock,
              title: "Protected Routes",
              desc: "Frontend guards plus backend policies — defense in depth.",
            },
            {
              icon: Database,
              title: "Postgres + RLS",
              desc: "Row-level security ensures users only see their own data.",
            },
            {
              icon: Shield,
              title: "Secure by Default",
              desc: "Roles stored separately to prevent privilege escalation.",
            },
            {
              icon: CheckCircle2,
              title: "Production Ready",
              desc: "Auto-created profiles, signup triggers, and audit timestamps.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border p-6 transition-all hover:shadow-[var(--shadow-elegant)]"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div
          className="rounded-2xl border border-border p-10 text-center shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="text-3xl font-bold text-primary-foreground">Try it now</h2>
          <p className="mt-3 text-primary-foreground/80">
            Sign up to see the full RBAC flow in action.
          </p>
          <Link to="/auth" search={{ mode: "signup" }}>
            <Button size="lg" variant="secondary" className="mt-6">
              Get started free
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
