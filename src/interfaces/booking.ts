
export default interface IBooking {
    _id?: string;
    type: string;
    location: string;
    proposedTimes: Array<Date>;
    selectedTime?: Date;
    status?: string;
    rejectReason?: string;
}