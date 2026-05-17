import Link from "next/link";

export const metadata = {
  title: "Login Error | SHUDDHAM",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5 flex flex-col items-center gap-6">
          <div className="h-16 w-16 bg-error/10 rounded-2xl flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-4xl">error</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-primary">Login Failed</h1>
            <p className="text-sm text-secondary max-w-[260px] leading-relaxed">
              Something went wrong during sign-in. This can happen if the link
              expired or you cancelled the flow.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/auth/login"
              className="flex justify-center w-full py-3 bg-primary text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-[0px_4px_12px_rgba(28,28,22,0.1)] hover:bg-primary/90 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="flex justify-center w-full py-3 border border-primary/10 text-primary text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/5 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-[10px] text-neutral-400 leading-relaxed">
            If this keeps happening, please contact{" "}
            <a
              href="mailto:care@shuddham.com"
              className="underline hover:text-primary transition-colors"
            >
              care@shuddham.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
