import { useEffect } from "react";
import { useRouter } from "next/router";

export default function usePagination(defaultLimit = 10) {
  const router = useRouter();
  const query = router.query;
  const page = parseInt((query.page || 1).toString(), 10);
  const limit = parseInt((query.limit || defaultLimit).toString(), 10);

  const setPage = (newPage: number) => {
    router.push({ query: { ...query, page: newPage } });
  };

  const setLimit = (newLimit: number) => {
    router.push({ query: { ...query, limit: newLimit, page: 1 } });
  };

  useEffect(() => {
    if (page !== 1 && query.search) {
      router.push({ query: { ...query, page: 1 } });
    }
  }, [query.search]);

  return { page, limit, setPage, setLimit, skip: (page - 1) * limit };
}
