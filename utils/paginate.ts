export const paginate = (currentPage: number, totalPages: number) => {
  let pages = [];
  if (currentPage <= 6) {
    pages = [1, 2, 3, 4, 5, 6, "..."];
  } else if (currentPage > totalPages - 6) {
    pages = [
      "...",
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  } else {
    pages = [
      "...",
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      "...",
    ];
  }
  return pages;
};
