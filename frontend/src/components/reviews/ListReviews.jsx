import React from "react";
import StarRatings from "react-star-ratings"

const ListReviews = ({ reviews }) => {

    

    return (
        <>
        <div class="reviews w-75">
        <h3>Other's Reviews:</h3>
        <hr />
        {reviews?.map((review) => (

<div key={review?._id} class="review-card my-3">
<div class="row">
  <div class="col-sm-12 col-md-6 col-lg-3 my-3">
    <img
      src={review?.user?.avatar ? review?.user?.avatar?.url : "https://github.com/ghulamabbas2/shopitv2-html/blob/master/images/default_avatar.jpg?raw=true"}
      alt="User Name"
      width="50"
      height="50"
      class="rounded-circle"
    />
  </div>
  <div class="col-11">
    <div class="star-ratings">
        <StarRatings
        rating={review?.rating}
        starRatedColor='yellow'
        numberOfStars={5}
        name='rating'
        starDimension='24px'
        starSpacing='1px'
         />
    </div>
    <p class="review_user">by {review?.name}</p>
    <p class="review_comment">{review?.comment}</p>
  </div>
</div>
<hr />
</div>
 ))}
      </div>
      </>
    )
}

export default ListReviews