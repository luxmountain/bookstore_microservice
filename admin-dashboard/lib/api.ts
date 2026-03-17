import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Service {
    id: string;
    name: string;
    displayName: string;
    endpoint: string;
    icon: string;
    color: string;
    description: string;
}

export const services: Service[] = [
    {
        id: 'catalog',
        name: 'Catalog Service',
        displayName: 'Danh mục sách',
        endpoint: '/api/catalogs/catalogs/',
        icon: '📚',
        color: 'bg-blue-500',
        description: 'Quản lý danh mục sách'
    },
    {
        id: 'book',
        name: 'Book Service',
        displayName: 'Sách',
        endpoint: '/api/books/books/',
        icon: '📖',
        color: 'bg-green-500',
        description: 'Quản lý thông tin sách'
    },
    {
        id: 'customer',
        name: 'Customer Service',
        displayName: 'Khách hàng',
        endpoint: '/api/customers/customers/',
        icon: '👥',
        color: 'bg-purple-500',
        description: 'Quản lý khách hàng'
    },
    {
        id: 'staff',
        name: 'Staff Service',
        displayName: 'Nhân viên',
        endpoint: '/api/staff/staff/',
        icon: '👨‍💼',
        color: 'bg-yellow-500',
        description: 'Quản lý nhân viên'
    },
    {
        id: 'manager',
        name: 'Manager Service',
        displayName: 'Quản lý',
        endpoint: '/api/managers/managers/',
        icon: '👔',
        color: 'bg-red-500',
        description: 'Quản lý hệ thống'
    },
    {
        id: 'cart',
        name: 'Cart Service',
        displayName: 'Giỏ hàng',
        endpoint: '/api/carts/carts/',
        icon: '🛒',
        color: 'bg-indigo-500',
        description: 'Quản lý giỏ hàng'
    },
    {
        id: 'order',
        name: 'Order Service',
        displayName: 'Đơn hàng',
        endpoint: '/api/orders/orders/',
        icon: '📦',
        color: 'bg-orange-500',
        description: 'Quản lý đơn hàng'
    },
    {
        id: 'payment',
        name: 'Payment Service',
        displayName: 'Thanh toán',
        endpoint: '/api/payments/payments/',
        icon: '💳',
        color: 'bg-pink-500',
        description: 'Quản lý thanh toán'
    },
    {
        id: 'shipping',
        name: 'Shipping Service',
        displayName: 'Vận chuyển',
        endpoint: '/api/shipments/shipments/',
        icon: '🚚',
        color: 'bg-teal-500',
        description: 'Quản lý vận chuyển'
    },
    {
        id: 'comment',
        name: 'Comment Service',
        displayName: 'Đánh giá',
        endpoint: '/api/comments/comments/',
        icon: '⭐',
        color: 'bg-cyan-500',
        description: 'Quản lý đánh giá và nhận xét'
    },
    {
        id: 'clothes',
        name: 'Clothe Service',
        displayName: 'Quần áo',
        endpoint: '/api/clothes/clothes/',
        icon: '👕',
        color: 'bg-rose-500',
        description: 'Quản lý sản phẩm quần áo'
    },
];

export async function fetchServiceData(endpoint: string, params?: any) {
    try {
        const response = await apiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function fetchRecordById(endpoint: string, id: string | number) {
    try {
        const response = await apiClient.get(`${endpoint}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching record:', error);
        throw error;
    }
}
