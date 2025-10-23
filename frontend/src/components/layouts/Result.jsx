import { useEffect } from "react"
import { useMyClassesQuery } from "../../redux/api/orderApi"
import Class from "./product/Classes"
import toast from "react-hot-toast"
import Attend from "./Attend"

const Result = () => {

    const {data, isLoading, error, isError} = useMyClassesQuery()

    useEffect(() => {
        if (isError) {
          toast.error(error?.data?.message)
        }
      }, [isError])

      const attendance = (data?.classes)
      console.log(data?.classes)

    return(
        <>
        <p></p>
        <h4 style={{color: "grey", padding: "5px"}}>Results & Exams<hr></hr></h4>
        <div className='row' >

               </div>
               </>
    )
}

export default Result