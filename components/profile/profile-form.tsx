"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { AppUser } from "@/types";
import { updateUserProfile } from "@/lib/services/users";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: AppUser;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      await updateUserProfile(user.authId, values);
      toast({
        title: "Profile updated",
        description: "Your personal information has been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Something went wrong while saving your profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-secondary ml-1">
            First Name
          </label>
          <input
            {...form.register("firstName")}
            className="w-full bg-surface border-none rounded-2xl px-5 py-4 text-primary font-body focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="Your first name"
          />
          {form.formState.errors.firstName && (
            <p className="text-red-500 text-[10px] ml-1 uppercase font-bold">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-secondary ml-1">
            Last Name
          </label>
          <input
            {...form.register("lastName")}
            className="w-full bg-surface border-none rounded-2xl px-5 py-4 text-primary font-body focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="Your last name"
          />
          {form.formState.errors.lastName && (
            <p className="text-red-500 text-[10px] ml-1 uppercase font-bold">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase font-bold tracking-widest text-secondary ml-1">
          Contact Number
        </label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-xl">
            call
          </span>
          <input
            {...form.register("phone")}
            type="tel"
            className="w-full bg-surface border-none rounded-2xl pl-12 pr-5 py-4 text-primary font-body focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="Enter your phone number"
          />
        </div>
        {form.formState.errors.phone && (
          <p className="text-red-500 text-[10px] ml-1 uppercase font-bold">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {isUpdating ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
};
