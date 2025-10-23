import React, { useEffect, useState } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Pagination from "react-js-pagination"
import "../../App.css"

const Custompagination = ({resPerPage, filteredProductsCount}) => {

const navigate = useNavigate()
const [currentPage, setCurrentPage] = useState()
let [searchParams] = useSearchParams();
const page = Number(searchParams.get("page")) || 1;
const savedMode = localStorage.getItem('darkMode') === 'true';

useEffect(() => {
    setCurrentPage(page)
}, [page])

const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber)

if (searchParams.has("page")) {
    searchParams.set("page", pageNumber)
} else {
    searchParams.append("page", pageNumber)
}
const path = window.location.pathname + "?" + searchParams.toString()
navigate(path)
navigate(0)

}


return (
    <>
<div className="d-flex justify-content-center my-5" >
    <div className={savedMode ? 'pagination-container dark-mode' : 'pagination-container'}>
 { filteredProductsCount > resPerPage && (
    <Pagination 
     activePage={currentPage}
     itemsCountPerPage={resPerPage}
     totalItemsCount={filteredProductsCount}
     onChange={setCurrentPageNo}
     nextPageText={"Next"}
     prevPageText={"Prev"}
     firstPageText={"First"}
     lastPageText={"Last"}
     itemClass="page-item"
     linkClass="page-link"
    />
 )}
    </div>
    </div>
    </>
)
}

export default Custompagination