import api from './api'

export const bookService = {
    getAll: (params = {}) => api.get('/books/books/', { params }),
    getById: (id) => api.get(`/books/books/${id}/`),
    search: (query) => api.get('/books/books/', { params: { search: query } }),
    getByCatalog: (catalogId) => api.get('/books/books/', { params: { catalog_id: catalogId } }),
}

export const catalogService = {
    getAll: () => api.get('/catalogs/catalogs/'),
    getById: (id) => api.get(`/catalogs/catalogs/${id}/`),
}

export const customerService = {
    login: (credentials) => api.post('/customers/customers/login/', credentials),
    register: (data) => api.post('/customers/customers/', data),
    getProfile: (id) => api.get(`/customers/customers/${id}/`),
    updateProfile: (id, data) => api.patch(`/customers/customers/${id}/`, data),
}

export const cartService = {
    getCart: (customerId) => api.get('/carts/carts/by_customer/', { params: { customer_id: customerId } }),
    addItem: (customerId, bookId, quantity = 1) =>
        api.post('/carts/carts/add_item/', { customer_id: customerId, book_id: bookId, quantity }),
    updateItem: (customerId, bookId, quantity) =>
        api.put('/carts/carts/update_item/', { customer_id: customerId, book_id: bookId, quantity }),
    removeItem: (customerId, bookId) =>
        api.delete('/carts/carts/remove_item/', { params: { customer_id: customerId, book_id: bookId } }),
    clearCart: (customerId) =>
        api.delete('/carts/carts/clear/', { params: { customer_id: customerId } }),
}

export const orderService = {
    create: (data) => api.post('/orders/orders/create_from_cart/', data),
    getAll: (customerId) => api.get('/orders/orders/', { params: { customer_id: customerId } }),
    getById: (id) => api.get(`/orders/orders/${id}/`),
    cancel: (id) => api.post(`/orders/orders/${id}/cancel/`),
}

export const paymentService = {
    create: (data) => api.post('/payments/payments/', data),
    getById: (id) => api.get(`/payments/payments/${id}/`),
}

export const commentService = {
    getByBook: (bookId) => api.get('/comments/comments/by_book/', { params: { book_id: bookId } }),
    create: (data) => api.post('/comments/comments/', data),
}

export const recommendationService = {
    getRecommendations: (customerId) =>
        api.get('/recommendations/recommendations/for_customer/', { params: { customer_id: customerId } }),
}

export const clotheService = {
    getAll: (params = {}) => api.get('/clothes/clothes/', { params }),
    getById: (id) => api.get(`/clothes/clothes/${id}/`),
}
