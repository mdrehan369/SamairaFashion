import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { RouterProvider, createHashRouter } from "react-router-dom"
import { Cart, Contact, Home, Shop, Signin, Signup, UserProductPage, Privacy, Shipping, Refund, Terms, AboutUs, CheckoutPage, Success, OrderDetails, SearchPage, NotFound } from './pages/index.js'
import AuthLayout from './components/AuthLayout.jsx'
import { store } from "./store/store.js";
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from "@react-oauth/google"

const router = createHashRouter([
    {
        path: '/',
        element: <AuthLayout><App /></AuthLayout>,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/signin',
                element: <Signin />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/cart',
                element: <Cart />
            },
            {
                path: '/shop',
                element: <Shop />
            },
            {
                path: '/product/:productId',
                element: <UserProductPage />
            },
            {
                path: '/checkoutPage',
                element: <CheckoutPage />
            },
            {
                path: '/success',
                element: <Success />
            },
            {
                path: '/orders',
                element: <OrderDetails />
            },
            {
                path: '/search',
                element: <SearchPage />
            }
        ],
    },
    // {
    //     path: '/admin',
    //     element: <AdminDashboard />,
    //     children: [
    //         {
    //             path: '/admin/overview',
    //             element: <Overview />
    //         },
    //         {
    //             path: '/admin/users',
    //             element: <Users />
    //         },
    //         {
    //             path: '/admin/products',
    //             element: <Products />
    //         },
    //         {
    //             path: '/admin/orders',
    //             element: <Orders />
    //         },
    //         {
    //             path: '/admin/addProduct',
    //             element: <AddProduct />
    //         },
    //         {
    //             path: '/admin/product/:productId',
    //             element: <ProductPage />
    //         }
    //     ]
    // },
    {
        path: '/policies',
        element: <AuthLayout><App /></AuthLayout>,
        children: [
            {
                path: '/policies/aboutus',
                element: <AboutUs />
            },
            {
                path: '/policies/contact',
                element: <Contact />
            },
            {
                path: '/policies/privacy',
                element: <Privacy />
            },
            {
                path: '/policies/shipping',
                element: <Shipping />
            },
            {
                path: '/policies/refund',
                element: <Refund />
            },
            {
                path: '/policies/terms',
                element: <Terms />
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(

    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </GoogleOAuthProvider>

)
