// Compatibility shim: re-export the cases API from index.ts
// This allows imports from "@/lib/cases/cases" to keep working.
export {
  getAllCases,
  getCaseBySlug,
  getCaseSlugs,
  getAllSlugs,
} from "./index";

export type { CaseDoc } from "./index";
