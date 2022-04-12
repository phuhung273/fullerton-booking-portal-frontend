interface IBooking {
    _id?: string;
    type: string;
    location: string;
    proposedTimes: Array<Date>;
    selectedTime?: Date;
    status?: 'review' | 'approve' | 'reject';
    rejectReason?: string;
}

export default IBooking;
