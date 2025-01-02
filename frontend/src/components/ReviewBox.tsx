import { Review } from "../types/Review";
import Rating from "./Rating";

function ReviewBox({ review }: { review: Review }) {
  return (
    <>
      <strong>{review.user.name}</strong>
      <Rating rating={review.rating} />
      <p>{review.review}</p>
    </>
  );
}

export default ReviewBox;
