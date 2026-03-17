import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20,
    duration: '30s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
    const payload = JSON.stringify({
        customer_id: 1,
        payment_method: 'cod',
        shipping_method: 'standard',
        shipping_address: '123 Test Street',
    });

    const res = http.post(`${BASE_URL}/api/orders/create_from_cart/`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
        'status is 202 or 400': (r) => r.status === 202 || r.status === 400,
    });

    sleep(1);
}
