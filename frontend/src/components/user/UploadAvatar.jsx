import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { useUploadAvatarMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData"

const UploadAvatar = () => {

  const [color, setColor] = useState("")
  const [textColor, setTextColor] = useState("")
  const savedMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    if(savedMode) {
       setColor("#0e1011")
       setTextColor("white")
    }
      else {
         setColor("#f8f8f8")
         setTextColor("black")
      }

  })

    const {user} = useSelector((state) => state.auth)

    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar ? user?.avatar?.url : "https://github.com/ghulamabbas2/shopitv2-html/blob/master/images/default_avatar.jpg?raw=true"
    )

    const navigate = useNavigate()

    const [uploadAvatar, {isLoading, error, isSuccess}] = useUploadAvatarMutation()

    useEffect(() => {

        if(error) {
            toast.error(error?.data?.message)
        }

        if(isSuccess) {
            toast.success("Avatar Uploaded")
            navigate("/me/profile")
        }

    }, [error, isSuccess])

    const submitHandler = (e) => {
        e.preventDefault()

        const userData = {
         avatar,
        }

        uploadAvatar(userData)

    }

    const onChange = (e) => {
    
        const reader = new FileReader()

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

       reader.readAsDataURL(e.target.files[0])
    }

    return (
      <>
            <MetaData title="Upload Avatar -  Qalam" />
        <UserLayout>
        <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form
            style={{ backgroundColor: color}}
            onSubmit={submitHandler}
          >
            <h2 className="mb-4" style={{ color: textColor}}>Upload Profile Pic</h2>
  
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <figure className="avatar item-rtl">
                    <img src={avatarPreview} className="rounded-circle" alt="image" />
                  </figure>
                </div>
                <div className="input-foam">
                  <label className="form-label" htmlFor="customFile" style={{ color: textColor}}>
                    Choose Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
  
            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"} 
            </button>
          </form>
        </div>
      </div>
      </UserLayout>
      </>
    )
}

export default UploadAvatar