"use client";

interface BreadcrumbProps {
  pageName: string;
  subPageName?: string;
}

const Breadcrumb = ({ pageName, subPageName }: BreadcrumbProps) => {
  return (
    <div className="flex select-none flex-col gap-3 py-4">
      <h1 className="text-2xl font-semibold text-black dark:text-white">
        {pageName}
      </h1>
      {subPageName && <p>{subPageName}</p>}

      {/* <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Apotekeren / BWF POS System /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav> */}
    </div>
  );
};

export default Breadcrumb;
