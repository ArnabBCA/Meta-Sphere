import moment from 'moment';

const useMoment = ( time ) => {
    const createdAt = moment(time);
    const duration = moment.duration(moment().diff(createdAt));
    let timeAgo;
    if (duration.asDays() >= 1) {
        timeAgo = Math.floor(duration.asDays()) + 'd';
    } else if (duration.asHours() >= 1) {
        timeAgo = Math.floor(duration.asHours()) + 'h';
    } else if (duration.asMinutes() >= 1) {
        timeAgo = Math.floor(duration.asMinutes()) + 'm';
    } else {
        timeAgo = 'Just now';
    }
    return timeAgo;
};

export default useMoment;
