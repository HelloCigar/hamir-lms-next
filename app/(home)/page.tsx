"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter()
  const { data: session } = authClient.useSession();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          toast.success("Signed out successfully.")
        },
      }
    })
  }

  async function signIn() {
    router.push("/login")
  }

  return (
    <>
    <section className="relative py-20">
      <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant="outline">
          The Future of Online Education
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate your learning experience</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Discover a new way to learn with our modern, interactive learning managament system. Access high-quality courses anytime, anywhere.
          </p>
      </div>
    </section>
    </>
  );
}
