import { WidgetSettingsForm } from "@/components/widget-settings-form";

export default function SettingsPage() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl sm:p-8">
      <WidgetSettingsForm />
    </section>
  );
}
