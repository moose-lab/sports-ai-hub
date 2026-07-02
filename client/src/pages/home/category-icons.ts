import {
  AppWindow,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Database,
  FlaskConical,
  FolderGit2,
  type LucideIcon,
  Package,
} from "lucide-react";

/** One icon per real catalog category id — presentation-only, not upstream data. */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  "apps-products": AppWindow,
  "open-source-projects": FolderGit2,
  "datasets-apis-feeds": Database,
  "developer-libraries-sdks": Package,
  "ai-models-components": BrainCircuit,
  "research-benchmarks": FlaskConical,
  "event-toolkits": CalendarDays,
  "learning-collections": BookOpen,
};

export const categoryIcon = (id: string): LucideIcon => CATEGORY_ICON[id] ?? Package;
