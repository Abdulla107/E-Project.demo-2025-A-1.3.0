import { motion } from "framer-motion";
import Ratings from "./Ratings";
import ReviewRating from "./ReviewRating";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";

const RatingSection = ({ pageNumber, setPageNumber }) => {

    const { reviews, totalReview, rating_review, parPage } = useSelector(state => state.home)

    const geroReview = totalReview - ((rating_review[0]?.sum || 0) + (rating_review[1]?.sum || 0) + (rating_review[2]?.sum || 0) + (rating_review[3]?.sum || 0) + (rating_review[4]?.sum || 0));


    return (
        <div className="flex flex-col gap-2 py-4">
            {[5, 4, 3, 2, 1, 0].map((rating, idx) => {
                const count = rating === 0 ? geroReview || 0 : rating_review[idx]?.sum || 0;
                const widthPercent = totalReview ? Math.floor((100 * count) / totalReview) : 0;

                return (
                    <motion.div
                        key={rating}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-start items-center gap-7"
                    >
                        {/* Rating Stars */}
                        <div className="text-xl flex gap-1 w-[93px]">
                            <Ratings ratings={rating} />
                        </div>

                        {/* Rating Bar */}
                        <div className="w-full max-w-xs h-[14px] bg-slate-200 rounded overflow-hidden">
                            <motion.div
                                className={`h-full ${rating === 0 ? "bg-gray-300" : "bg-[#EDBB0E]"}`}
                                style={{ width: `${widthPercent}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${widthPercent}%` }}
                                transition={{ duration: 0.5 }}
                                title={`${widthPercent}%`}
                            />
                        </div>

                        {/* Count */}
                        <span className="text-sm text-slate-600">{count}</span>
                    </motion.div>
                );
            })}

            {/* Reviews Section */}
            {reviews && reviews.length > 0 ? (
                <div>
                    <h2 className="text-slate-600 text-xl font-bold py-5">
                        Product Reviews ({reviews.length})
                    </h2>
                    <div className="flex flex-col gap-8 pb-10">
                        {reviews.map((r, i) => (
                            <div key={i} className="flex flex-col gap-1 py-5 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1 text-xl">
                                        <ReviewRating rating={r.rating} />
                                    </div>
                                    <span className="text-slate-600 text-sm">{r.date}</span>
                                </div>
                                <span className="text-slate-600 font-semibold">{r.name}</span>
                                <span className="text-slate-600 text-sm">{r.review}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-slate-500 py-10">
                    <p>This product has not received a written review yet.</p>
                    <p>Let others know what you think and be the first to write a review.</p>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-end">
                {totalReview > parPage && (
                    <Pagination
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        totalItem={totalReview}
                        parPage={parPage}
                        showItem={Math.ceil(totalReview / parPage) > 4 ? 4 : Math.ceil(totalReview / parPage)}
                    />
                )}
            </div>
        </div>
    );
};

export default RatingSection;
