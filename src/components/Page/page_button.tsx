import React, { FunctionComponent, useState } from "react";
import "./Page.scss";

type PageNavigatorProps = {
  number_of_pages: number;
  Change_Page: (page_number: number) => void;
};

export const PageNavigator: FunctionComponent<PageNavigatorProps> = ({
  Change_Page,
  number_of_pages,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const SelectedColor = "#525357";
  const unSelectedColor = "#313336";
  let pages = [],
    shownPages = [];
  for (let i = 1; i <= number_of_pages; i++) {
    pages.push(i);
  }
  let from, to;
  if (currentPage - 3 < 1) {
    from = 0;
    to = number_of_pages < 7 ? number_of_pages : 7;
  } else if (currentPage + 3 > number_of_pages) {
    to = number_of_pages;
    from = number_of_pages >= 7 ? number_of_pages - 7 : 0;
  } else {
    from = currentPage - 3 - 1;
    to = currentPage + 3;
  }
  shownPages = pages.slice(from, to);
  const on_Change_Page = (page_number: number) => {
    if (page_number > 0 && page_number <= number_of_pages) {
      setCurrentPage(page_number);
      Change_Page(page_number);
    }
  };
  return (
    <ul className="page-list">
      <button onClick={() => on_Change_Page(currentPage - 1)}>←</button>
      {shownPages.map((i) => (
        <li
          key={i}
          style={{
            backgroundColor:
              i === currentPage ? SelectedColor : unSelectedColor,
          }}
        >
          <PageButton on_Change_Page={() => on_Change_Page(i)}>{i}</PageButton>
        </li>
      ))}
      <button onClick={() => on_Change_Page(currentPage + 1)}>→</button>
    </ul>
  );
};

type PageProps = {
  on_Change_Page: () => void;
};
export const PageButton: FunctionComponent<PageProps> = ({
  on_Change_Page,
  children,
}) => {
  return (
    <a className="page-button" onClick={on_Change_Page}>
      {children}
    </a>
  );
};
