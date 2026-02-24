import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from "lucide-react";
import { DropdownMenu } from "./dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

const Header = () => {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
  
  <nav className="container mx-auto px-3 h-16 flex items-center justify-between">

    {/* LEFT SIDE */}
    <Link href="/" className="flex items-center">
      <Image
        src="/logo1.png"
        alt="Sensei Logo"
        width={140}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
    </Link>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">

      <SignedIn>
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:block">Industry Insights</span>
          </Button>
        </Link>
      

      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button >
            <StarsIcon className="h-4 w-4" />
            <span className="hidden md:block">Growth Tools</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            
              <DropdownMenuItem>
                <Link href="/resume">
                  <FileText className="h-4 w-4" />
                  <span>Build Resume</span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/cover-letter">
                  <PenBox className="h-4 w-4" />
                  <span> Cover Letter </span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/interview-prep">
                  <GraduationCap className="h-4 w-4" />
                  <span> Interview Prep </span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button variant="outline" className="flex items-center gap-2">
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>

        

        <SignedIn>
          <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "h-10 w-10",
            },
          }}
          
          />
        </SignedIn>

    </div>

  </nav>
</header>
  );
};

export default Header;