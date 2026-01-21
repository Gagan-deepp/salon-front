import { LoginForm } from "@/components/login-form";
import rynoxLogo from "@/assets/new-logo-png.png";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export default function Page() {
  return (

    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-2 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center space-x-2 group text-center w-full  ">
            <Image
              src={rynoxLogo.src}
              alt="Rynox"
              width={100}
              height={100}
              className="h-16 md:h-18 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="w-full text-center flex flex-col gap-4" >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold" > Welcome back! </h1>
          <div className="text-center text-base md:text-base text-foreground/70 max-w-3xl mx-auto leading-relaxed font-medium" >
            <p> Go beyond POS. RYY-NOX centralizes every store </p>
            <p> Login to continue </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">

          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/login_banner.svg"
          alt="Image"
          width={100}
          height={100}  
          quality={100}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
