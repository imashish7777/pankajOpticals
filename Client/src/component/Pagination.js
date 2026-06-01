import React, {
  memo,
  useMemo,
} from "react";

function Pagination({
  onChange,
  current = 1,
  totalPages = 3,
}) {

  // create page numbers
  const pages = useMemo(() => {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }, [totalPages]);

  return (
    <nav
      aria-label="Pagination Navigation"
    >
      <ul className="pagination">

        {/* Previous */}

        <li className="page-item">
          <button
            type="button"
            className="page-link"
            disabled={current === 1}
            onClick={() =>
              onChange(current - 1)
            }
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${
              current === page
                ? "active"
                : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() =>
                onChange(page)
              }
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next */}

        <li className="page-item">
          <button
            type="button"
            className="page-link"
            disabled={
              current === totalPages
            }
            onClick={() =>
              onChange(current + 1)
            }
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default memo(Pagination);