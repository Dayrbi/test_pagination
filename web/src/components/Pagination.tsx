
import { } from 'react-bootstrap';

type HomeProps = {
    totalPages: number
    currentPage: number
    pages: number[]
    onPageChange: (page: number) => void
  }

export const Pagination = ({totalPages, currentPage, pages, onPageChange}: HomeProps) => {
    if (totalPages === 1) return null;
    
    const onPrevPage = (full = false) => {
        if(full) {
            onPageChange(1);
        }
        else {
            const prevPage = (currentPage - 1) >= 1 ? (currentPage - 1) : 1;
            onPageChange(prevPage);
        }
    }

    const onNextPage = (full = false) => {
        if(full) {
            onPageChange(totalPages);
        }
        else {
            const nextPage = (currentPage + 1) <= totalPages ? (currentPage + 1) : totalPages;
            onPageChange(nextPage);
        }
    }
    return (
        <div>       
             <ul className='pagination' >
                <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
                    <a className="page-link" aria-label="Previous" onClick={() => onPrevPage(true)}>
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li className={currentPage === 1 ? "page-item disabled" : "page-item"} style={{marginLeft: '5px'}}>
                    <a className="page-link" aria-label="Previous" onClick={() => onPrevPage()}>
                        <span aria-hidden="true">&lsaquo;</span>
                    </a>
                </li>
                {pages.map((page) => (
                <li 
                className={page === currentPage ? "page-item active" : "page-item"}
                key={page}
                style={{marginLeft: '5px'}}
                >
                    <a className='page-link' onClick={() => onPageChange(page)}>{page}</a>
                </li>
                ))}
                <li className={currentPage === totalPages ? "page-item disabled" : "page-item"} style={{marginLeft: '5px'}}>
                    <a className="page-link" aria-label="Previous" onClick={() => onNextPage()}>
                        <span aria-hidden="true">&rsaquo;</span>
                    </a>
                </li>                   
                <li className={currentPage === totalPages ? "page-item disabled" : "page-item"} style={{marginLeft: '5px'}}>
                    <a className="page-link" aria-label="Previous" onClick={() => onNextPage(true)}>
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>            
            </ul>
        </div>
    )
}