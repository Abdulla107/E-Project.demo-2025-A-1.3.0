import productReducer from './reducers/productReducers';
import authReducer from './reducers/authReducer';
import categoryReducer from './reducers/categoryReducer';
import chatReducer from './reducers/chatReducer';
import orderReducer from './reducers/orderReducer';
import paymentReducer from './reducers/paymentReducer';

const rootReducer = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  chat: chatReducer,
  order: orderReducer,
  payment: paymentReducer,
};

export default rootReducer;
