import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './Adminmyorder.css';
import axios from 'axios';
import { Truck, Package } from 'lucide-react';
import AlertSuccessMessage from './alertSuccess.jsx';
import AlertFailureMessage from './alertFailure.jsx';
import MorphingLoader from './MorphingLoader.jsx';

export default function TodaysOrders() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderStatuses, setOrderStatuses] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [falertVisible, setFAlertVisible] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setOrderStatuses(
            orders.reduce((acc, order) => {
                acc[order._id] = order.orderStatus;
                return acc;
            }, {})
        );
    }, [orders]);

    const calculateOrderTotal = (cart) => {
        if (!Array.isArray(cart)) return 0;
        
        return cart.reduce((total, item) => {
            // Check if price is an array and take the first value (assuming it's the actual price)
            const price = Array.isArray(item.price) ? item.price[0] : item.price;
            return total + (Number(price) * Number(item.qty));
        }, 0);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/getorders`, { withCredentials: true });
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                console.error('Failed to fetch orders:', response.data.message);
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (event) => {
        const { name, value } = event.target;
        const orderId = name.split('_')[1];
        setOrderStatuses((prevStatuses) => ({
            ...prevStatuses,
            [orderId]: value,
        }));
    };

    const updatestatusindb = async () => {
        const updatedStatus = orders.map((order) => ({
            orderId: order._id,
            status: orderStatuses[order._id],
        }));

        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/updateOrderStatus`, updatedStatus, { withCredentials: true });
            setAlertMessage(response.data.message);
            setAlertVisible(true);
        } catch (error) {
            setAlertMessage('Failed to update order status. Please try again later.');
            setFAlertVisible(true);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cart?.some(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate total revenue from cart items
    const totalRevenue = filteredOrders.reduce((sum, order) => {
        return sum + calculateOrderTotal(order.cart);
    }, 0);

    return (
        <div className="todays-orders">
            {alertVisible && (
                <AlertSuccessMessage 
                    message={alertMessage} 
                    onClose={() => setAlertVisible(false)}
                />
            )}
            {falertVisible && (
                <AlertFailureMessage    
                    message={alertMessage}
                    onClose={() => setFAlertVisible(false)}
                />
            )}
            {loading ? (
                <MorphingLoader />
            ) : (
                <>
                    <div className="heading1">
                        <h1>All Orders</h1>
                    </div>

                    <div className="summary">
                        <div className="card">
                            <h2>Total Orders</h2>
                            <p>{filteredOrders.length}</p>
                        </div>
                        <div className="card">
                            <h2>Total Revenue</h2>
                            <p>&#8377;{totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Order Status</th>
                                <th>Order Time</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.orderId}</td>
                                    <td>{`${order.firstName || ''} ${order.lastName || ''}`}</td>
                                    <td>
                                        <div className="status-checkbox">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`order_${order._id}`}
                                                    value="Dispatched"
                                                    checked={orderStatuses[order._id] === "Dispatched"}
                                                    onChange={handleStatusChange}
                                                />
                                                <Truck size={24} className='truck' />
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`order_${order._id}`}
                                                    value="Delivered"
                                                    checked={orderStatuses[order._id] === "Delivered"}
                                                    onChange={handleStatusChange}
                                                />
                                                <Package size={24} className='package' />
                                            </label>
                                        </div>
                                    </td>
                                    <td>{format(new Date(order.created_At), "HH:mm:ss")}</td>
                                    <td>&#8377;{calculateOrderTotal(order.cart).toFixed(2)}</td>
                                    <td>View Details</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={updatestatusindb}
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#218838")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#28a745")
                        }
                    >
                        Update in Database
                    </button>
                </>
            )}
        </div>
    );
}