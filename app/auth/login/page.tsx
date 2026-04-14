import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { siteConfig } from "@/constants";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            Welcome to {siteConfig.shortName}
          </h1>
          <p className="text-secondary font-body">
            Experience organic wellness, delivered to your doorstep.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5 flex flex-col items-center gap-6">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">eco</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-primary">Sign in to your account</h2>
            <p className="text-sm text-secondary">Choose your preferred login method</p>
          </div>

          <GoogleLoginButton />

          <p className="text-[10px] text-neutral-400 max-w-[240px] leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="pt-8">
          <a 
            href="/" 
            className="text-xs uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
