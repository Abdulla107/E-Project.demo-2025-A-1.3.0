import toast from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';

let currentToastId = null;

export const showCustomToast = ({ name, message, image, senderId, navigate }) => {

    const navigateHandler = (t) => {
        navigate(`/admin/chat_customer/${senderId}`)
        toast.dismiss(t.id)
    }

    if (currentToastId) {
        toast.dismiss(currentToastId);
    }


    currentToastId = toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-400 ring-opacity-5`} >
            <div onClick={navigateHandler} className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        {image ?
                            <img
                                className="h-10 w-10 rounded-full"
                                src={image}
                                alt=""
                            /> : <FaUserCircle className="w-10 h-10 rounded-full text-gray-500" />
                        }
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {name || 'Someone'}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {message.slice(0, 80) || 'You received a message'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-200">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    ));
};
