import { LoginForm } from "@/components/login-form";
import rynoxLogo from "@/assets/rynox-logo.png";


export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Logo */}
        <a href="#hero" className="flex items-center space-x-2 group text-center w-full justify-center ">
          <img
            src={rynoxLogo.src}
            alt="Rynox"
            className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105"
          />
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
