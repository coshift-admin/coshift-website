"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { cn } from "@/lib/cn";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  projectType: z.enum(["erp", "web", "email", "other"]),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: { projectType: "erp" },
  });

  const onSubmit = async (data: FormData) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("server");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-live="polite"
    >
      <Field label={t("name")} error={errors.name?.message}>
        <input
          type="text"
          autoComplete="name"
          className={inputCls}
          {...register("name", { required: t("validation.required") })}
        />
      </Field>
      <Field label={t("company")} error={errors.company?.message}>
        <input
          type="text"
          autoComplete="organization"
          className={inputCls}
          {...register("company")}
        />
      </Field>
      <Field label={t("email")} error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          className={inputCls}
          {...register("email", {
            required: t("validation.required"),
            pattern: { value: /\S+@\S+\.\S+/, message: t("validation.email") },
          })}
        />
      </Field>

      <fieldset className="space-y-3">
        <legend className="text-mono mb-2 text-[var(--coshift-bone)]/60">
          {t("projectType")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {(["erp", "web", "email", "other"] as const).map((opt) => (
            <label key={opt} className="cursor-pointer">
              <input
                type="radio"
                value={opt}
                className="peer sr-only"
                {...register("projectType")}
              />
              <span className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm peer-checked:border-[var(--coshift-cyan)] peer-checked:bg-[var(--coshift-cyan)] peer-checked:text-[var(--coshift-ink)]">
                {t(`projectTypes.${opt}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={t("message")} error={errors.message?.message}>
        <textarea
          rows={6}
          className={cn(inputCls, "resize-y")}
          {...register("message")}
        />
      </Field>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-3 rounded-full bg-[var(--coshift-cyan)] px-6 py-3 text-base font-semibold text-[var(--coshift-ink)] transition-colors hover:bg-[var(--coshift-glow)] disabled:opacity-60"
        >
          {status === "submitting" ? t("submitting") : t("submit")} →
        </button>
        {status === "success" && (
          <p className="text-mono text-[var(--coshift-cyan)]">{t("success")}</p>
        )}
        {status === "error" && (
          <p className="text-mono text-[#ff8a7a]">{t("error")}</p>
        )}
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-[var(--coshift-haze)] px-4 py-3 text-base text-[var(--coshift-bone)] outline-none transition-colors focus:border-[var(--coshift-cyan)]";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-mono mb-2 block text-[var(--coshift-bone)]/60">
        {label}
      </span>
      {children}
      {error && (
        <span className="text-mono mt-1 block text-[#ff8a7a]">{error}</span>
      )}
    </label>
  );
}
