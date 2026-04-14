"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReviewAction } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  userId: string | null;
}

export const ReviewForm = ({ productId, userId }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !body) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and a review comment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await submitReviewAction({
        productId,
        userId,
        rating,
        title,
        body,
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your wellness ritual matters to us.",
      });

      setIsOpen(false);
      setTitle("");
      setBody("");
      setRating(5);
      router.refresh();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="rounded-full border-primary/20 text-primary hover:bg-primary/5 px-8 h-12 text-[10px] uppercase tracking-[0.2em] font-bold transition-all"
      >
        Write a Review
      </Button>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-[0px_20px_40px_rgba(28,28,22,0.06)] animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline text-2xl text-primary font-bold">Share Your Experience</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-primary/40 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest font-label">Ritual Experience</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all duration-200 active:scale-90"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-3xl transition-colors duration-200",
                    (hover || rating) >= star ? "text-tertiary filled-icon" : "text-outline-variant"
                  )}
                  style={{ fontVariationSettings: (hover || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
                >
                  { (hover || rating) >= star ? "star" : "star" }
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-primary self-center bg-primary/5 px-3 py-1 rounded-full">
              {rating}/5
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest font-label">Review Headline</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience..."
            className="w-full h-14 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            required
          />
        </div>

        {/* Body */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest font-label">Detailed Thoughts</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you love? How did it make you feel?"
            rows={4}
            className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-full bg-primary text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary/90 shadow-[0px_8px_24px_rgba(28,28,22,0.15)] transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Submitting Ritual..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};
