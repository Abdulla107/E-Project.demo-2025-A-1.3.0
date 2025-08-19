import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authorization_user, user_get_admin_image } from '../store/reducers/authReducer'
import { jwtDecode } from 'jwt-decode'
import { socket } from '../utils/utils'
import { unSaw_message_count_update, update_message_status, update_one_message_status } from '../store/reducers/chatReducer'
import { showCustomToast } from '../components/notification/CustomToast';

const ExtaLayout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pathname } = useLocation();
    const [recevedMessage, setRecevedMessage] = useState('')

    const { token, userInfo, admin_image } = useSelector((state) => state.auth);
    const { total_unSaw_message } = useSelector(state => state.chat)


      useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            dispatch(authorization_user({ decoded }));
        }
    }, [token]);


    useEffect(() => {
        if (userInfo?.id) {
            socket.emit('join_user', { userId: userInfo.id })
        }

        const handleReceived_message = (msg) => {
            setRecevedMessage(msg)
        }
        socket.on('received_admin_message', handleReceived_message)

        return () => {
            socket.off('received_admin_message', handleReceived_message)
        }


    }, [userInfo?.id])

    useEffect(() => {
        if (userInfo?.id) {
            dispatch(user_get_admin_image())
        }
    }, [userInfo])


    useEffect(() => {
        if (!recevedMessage) return;
        if (pathname === '/dashboard/chat-support') {

            if (recevedMessage?.receverId) {
                dispatch(update_one_message_status(recevedMessage.receverId));
                dispatch(unSaw_message_count_update('one'));
            }

        } else if (recevedMessage) {
            showCustomToast({
                message: recevedMessage.message,
                image: admin_image,
                navigate,
            });

            dispatch(unSaw_message_count_update('inc'));
        }

        setRecevedMessage(null);

    }, [recevedMessage, pathname, userInfo?.id,])


    useEffect(() => {
        if (!total_unSaw_message) return
        if (pathname === '/dashboard/chat-support') {

            if (userInfo?.id && total_unSaw_message > 0) {
                dispatch(update_message_status(userInfo.id));
                dispatch(unSaw_message_count_update('all'));
            }
        }
    }, [userInfo?.id, pathname, total_unSaw_message])


    return <Outlet />;

}

export default ExtaLayout;
