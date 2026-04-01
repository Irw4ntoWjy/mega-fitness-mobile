// Perlu Get List Package
// Perlu Get Detail Package

import { fetcher } from "@/lib/fetcher";
import { TrainerPackage } from "@/type/package";
import { buildListPayload } from "@/type/pagination";

export function getPackageTrainerList(payload?: { package_detail_id: string }) {
  return fetcher<TrainerPackage[]>("/package/trainer/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
