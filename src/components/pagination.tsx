export default function PaginationDataButton({
  currentPage,
  totalPage,
  setCurrentPage,
  goToPage, // Terima goToPage sebagai props
}: {
  currentPage: number;
  totalPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  goToPage: (page: number) => void; // Tambahkan tipe untuk goToPage
}) {
  const getPaginationRange = () => {
    const range = [];
    const totalVisiblePages = 5;

    if (totalPage <= totalVisiblePages) {
      for (let i = 1; i <= totalPage; i++) range.push(i);
    } else {
      if (currentPage <= 3) {
        range.push(1, 2, 3, "...", totalPage);
      } else if (currentPage >= totalPage - 2) {
        range.push(1, "...", totalPage - 2, totalPage - 1, totalPage);
      } else {
        range.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPage,
        );
      }
    }

    return range;
  };

  const handlePageClick = (page: any) => {
    if (page === "...") return;
    setCurrentPage(page);
    goToPage(page); // Panggil goToPage untuk mengubah URL saat halaman berubah
  };

  return (
    <div>
      {totalPage == 0 || currentPage > totalPage ? (
        <></>
      ) : (
        <div className="flex justify-start p-8">
          <div className="text-sm">
            <button
              className={`rounded bg-gray px-3 py-1 text-black ${
                currentPage === 1 && "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                goToPage(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >
              prev
            </button>
            {getPaginationRange().map((page, index) => (
              <button
                key={index}
                className={`rounded px-3 py-1 ${
                  page === currentPage
                    ? "cursor-not-allowed bg-primary text-white"
                    : "bg-gray text-black "
                } ${page === "..." && "cursor-default"}`}
                onClick={() => handlePageClick(page)}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}
            <button
              className={`bg-gray-300 rounded px-3 py-1 text-black ${
                currentPage === totalPage && "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                goToPage(currentPage + 1);
              }}
              disabled={currentPage === totalPage}
            >
              next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
