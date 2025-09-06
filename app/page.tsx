"use client"

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
    <div>
      Hello World
      <ThemeToggle />

      { session ? (
        <div>
          <p>{session.user.name}</p>
          <Button onClick={signOut}>
            Logout
          </Button>
        </div>
      ) : (
          <Button onClick={signIn}>Login</Button>
        )
      }
    </div>
  );
}
