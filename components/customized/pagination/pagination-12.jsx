import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationNumberless({ pagination }) {
  return (
    <div className="w-full flex mt-8 justify-center" >
      <div className=" max-w-md w-full">
        <Pagination className="w-full">
          <PaginationContent className="w-full justify-between">
            <PaginationItem>
              <PaginationPrevious href={`?page=${pagination.page - 1}`} className={`border ${pagination.page === 1 ? "opacity-50 pointer-events-none" : ""}`} aria-disabled={pagination.page === 1} />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`?page=${pagination.page + 1}`} className={`border ${pagination.page === pagination.totalPages ? "opacity-50 pointer-events-none" : ""}`} aria-disabled={pagination.page === pagination.totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
