
import productReducer from './reducers/productReducer';
import categoryReducer from './reducers/categoryReducer';
import homeReducer from './reducers/homeReducer';
import authReducer from './reducers/authReducer';
import cardReducer  from './reducers/cardReducer';
import orderReducer  from './reducers/orderReducer';
import chatReducer from './reducers/chatReducer';

const rootReducer = {
    auth: authReducer,
    home: homeReducer,
    product: productReducer,
    category: categoryReducer,
    card: cardReducer,
    order: orderReducer,
    chat: chatReducer,
}

export default rootReducer;