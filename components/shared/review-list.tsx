import { Star } from "lucide-react";

import { getInitials } from "@/lib/utils";
import type { Review } from "@/types";

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-[24px] border border-border bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                {getInitials(review.user.firstName, review.user.lastName)}
              </div>
              <div>
                <p className="font-semibold">
                  {review.user.firstName} {review.user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{review.title}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />
              {review.rating}
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{review.body}</p>
        </div>
      ))}
    </div>
  );
};
