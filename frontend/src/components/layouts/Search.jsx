import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css"

const Search = () => {

    const [keyword, setKeyword] = useState("")
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`)
            console.log(navigate)

        } else {
            navigate(`/`)
        }

    }

    return (
      <>      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <form onSubmit={submitHandler}>
          <div className="input-group">
            <input
              type="text"
              id="search_field"
              aria-describedby="search_btn"
              className="form-control"
              placeholder="Enter Product Name"
              name="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              
            />
            <button id="search_btn" className="btn" type="submit">
              <i className="fa" >&#xf002;</i> 
            </button>
          </div>
        </form>
        </>

    )
}

export default Search