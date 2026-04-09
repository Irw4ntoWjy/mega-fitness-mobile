// Perlu Get List Package
// Perlu Get Detail Package

import { fetcher } from "@/lib/fetcher";
import { Package, PackagePagination, TrainerPackage } from "@/type/package";
import { buildListPayload } from "@/type/pagination";

export function getPackageTrainerList(payload?: { package_detail_id: string }) {
  return fetcher<TrainerPackage[]>("/package/trainer/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function getPackageList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
}) {
  return fetcher<PackagePagination>("/package/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function getPackageDetail(payload: { package_id: string }) {
  return fetcher<Package>("/package/detail", {
    body: payload,
    auth: true,
  });
}
