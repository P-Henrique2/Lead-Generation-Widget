"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

type CaptureFields = {
  name: boolean;
  email: boolean;
  message: boolean;
};

type WidgetSettingsFormValues = {
  title: string;
  accentColor: string;
  captureFields: CaptureFields;
};

const widgetSettingsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(60, { message: "Title must be 60 characters or less" }),
  accentColor: z
    .string()
    .trim()
    .min(1, { message: "Accent color is required" })
    .regex(/^#([0-9a-f]{3}){1,2}$/i, {
      message: "Enter a valid hex color, e.g. #06b6d4",
    }),
  captureFields: z
    .object({
      name: z.boolean(),
      email: z.boolean(),
      message: z.boolean(),
    })
    .superRefine((value, context) => {
      if (!value.name && !value.email && !value.message) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one capture field must stay enabled.",
        });
      }
    }),
});

const captureFieldMeta = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "message" as const, label: "Message" },
];

export default function SettingsPage() {
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<WidgetSettingsFormValues>({
    defaultValues: {
      title: "",
      accentColor: "#06b6d4",
      captureFields: {
        name: true,
        email: true,
        message: true,
      },
    },
  });

  const captureFields = watch("captureFields");
  const { ref: titleRef, ...titleFieldProps } = register("title");
  const { ref: accentColorRef, ...accentColorFieldProps } = register("accentColor");

  const updateCaptureField = (field: keyof CaptureFields, checked: boolean) => {
    const nextCaptureFields = {
      ...captureFields,
      [field]: checked,
    };

    setValue("captureFields", nextCaptureFields, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (errors.captureFields) {
      clearErrors("captureFields");
    }
  };

  const onSubmit = (values: WidgetSettingsFormValues) => {
    const parsed = widgetSettingsSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0] === "title") {
          setError("title", { type: "manual", message: issue.message });
        }

        if (issue.path[0] === "accentColor") {
          setError("accentColor", { type: "manual", message: issue.message });
        }

        if (issue.path[0] === "captureFields") {
          setError("captureFields", { type: "manual", message: issue.message });
        }
      });

      if (errors.title || !values.title.trim()) {
        titleInputRef.current?.focus();
      }

      return;
    }

    console.log("Widget config saved:", parsed.data);
    setSuccessMessage("Widget settings saved successfully.");
  };

  const onInvalid = () => {
    titleInputRef.current?.focus();
  };

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Settings</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Widget configuration</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
        Configure how your widget looks and which contact details you need to collect.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-8 space-y-6"
        noValidate
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Branding</h2>
              <p className="mt-1 text-sm text-slate-400">Set the widget title and accent color.</p>
            </div>
            <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
              Live preview
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="widget-title" className="mb-2 block text-sm font-medium text-slate-200">
                Widget title
              </label>
              <input
                id="widget-title"
                ref={(element) => {
                  titleInputRef.current = element;
                  titleRef(element);
                }}
                type="text"
                maxLength={60}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                className={cn(
                  "w-full rounded-2xl border bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2",
                  errors.title
                    ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/25"
                    : "border-slate-700 focus:border-cyan-400 focus:ring-cyan-400/25",
                )}
                placeholder="Flowstate"
                {...titleFieldProps}
              />
              {errors.title ? (
                <p id="title-error" role="alert" className="mt-2 text-sm text-rose-300">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="accent-color" className="mb-2 block text-sm font-medium text-slate-200">
                Accent color
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  id="accent-color"
                  ref={accentColorRef}
                  type="text"
                  inputMode="text"
                  aria-invalid={Boolean(errors.accentColor)}
                  aria-describedby={errors.accentColor ? "accent-color-error" : undefined}
                  className={cn(
                    "w-full rounded-2xl border bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 sm:max-w-[220px]",
                    errors.accentColor
                      ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/25"
                      : "border-slate-700 focus:border-cyan-400 focus:ring-cyan-400/25",
                  )}
                  placeholder="#06b6d4"
                  {...accentColorFieldProps}
                />
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span className="text-sm text-slate-400">Preview</span>
                  <span
                    className="h-5 w-5 rounded-full border border-white/10"
                    style={{ backgroundColor: watch("accentColor") || "#06b6d4" }}
                  />
                </div>
              </div>
              {errors.accentColor ? (
                <p id="accent-color-error" role="alert" className="mt-2 text-sm text-rose-300">
                  {errors.accentColor.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Capture fields</h2>
            <p className="mt-1 text-sm text-slate-400">Choose which fields appear in the widget form.</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {captureFieldMeta.map((field) => {
              const checked = captureFields?.[field.key] ?? true;

              return (
                <label
                  key={field.key}
                  htmlFor={`capture-${field.key}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
                >
                  <span>{field.label}</span>
                  <input
                    id={`capture-${field.key}`}
                    type="checkbox"
                    role="switch"
                    checked={checked}
                    aria-checked={checked}
                    aria-invalid={Boolean(errors.captureFields)}
                    aria-describedby={errors.captureFields ? "capture-fields-error" : undefined}
                    className="h-5 w-5 rounded border-slate-600 bg-slate-950 text-cyan-400 focus:ring-cyan-400/30"
                    onChange={(event) => updateCaptureField(field.key, event.target.checked)}
                  />
                </label>
              );
            })}
          </div>

          {errors.captureFields ? (
            <p id="capture-fields-error" role="alert" className="mt-3 text-sm text-rose-300">
              {typeof errors.captureFields.message === "string" ? errors.captureFields.message : null}
            </p>
          ) : null}
        </div>

        {successMessage ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100" role="status">
            {successMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">Changes are validated in real time before they are saved.</p>
          <button
            type="submit"
            className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Save widget settings
          </button>
        </div>
      </form>
    </section>
  );
}
