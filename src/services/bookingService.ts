import IBooking from "../interfaces/booking";
import http from "./httpClient";

function index() {
    return http.get("/bookings");
};

function remove(id: string) {
    return http.delete(`/bookings/${id}`);
};

function store(data: IBooking) {
    // Ensure only these data be sent
    const { type, location, proposedTimes } = data;

    return http.post("/bookings", {
        type,
        location,
        proposedTimes,
    });
};

function approve(id:string, index: number) {
    return http.post(`/bookings/${id}/approve`, {
        index
    });
};

function reject(id:string, rejectReason: string) {
    return http.post(`/bookings/${id}/reject`, {
        rejectReason
    });
};

export default {
    index,
    store,
    remove,
    approve,
    reject,
}