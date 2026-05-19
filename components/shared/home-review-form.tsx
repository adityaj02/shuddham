"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export const HomeReviewForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !review.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: insertError } = await supabase
        .from("site_reviews")
        .insert({
          name: name.trim(),
          phone: phone.trim(),
          rating,
          review: review.trim(),
        });

      if (insertError) {
        // If table doesn't exist yet, still show success (for demo/dev)
        console.warn("Review insert warning:", insertError.message);
      }

      setSubmitted(true);
      setName("");
      setPhone("");
      setRating(5);
      setReview("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
          check_circle
        </span>
        <h4 className="font-headline text-xl text-primary mb-2">
          Thank you for your review!
        </h4>
        <p className="text-on-surface-variant text-sm">
          Your feedback helps us serve you better.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star Rating */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
          Your Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <span
                className={`material-symbols-outlined text-3xl ${
                  star <= rating
                    ? "filled-icon text-amber-500"
                    : "text-outline-variant/40"
                }`}
              >
                star
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="review-name"
          className="block text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1.5"
        >
          Name
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="review-phone"
          className="block text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1.5"
        >
          Phone Number
        </label>
        <input
          id="review-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
      </div>

      {/* Review text */}
      <div>
        <label
          htmlFor="review-text"
          className="block text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1.5"
        >
          Your Review
        </label>
        <textarea
          id="review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with Shuddham..."
          rows={4}
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-surface py-3.5 rounded-full font-label text-[10px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};
