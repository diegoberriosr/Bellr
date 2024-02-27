import moment from 'moment'

export const formatDate = (post) => {

    const difference = moment().utc().diff(post.timestamp, 'days'); // Check the time distance between current time and the post's timestamp

    if (difference < 7) { // Output result in 'X time ago') if difference is less than 7 days
        return moment.utc(post.timestamp).fromNow();
    }

    return moment.utc(post.timestamp).format('YYYY-MM-DD'); // Otherwise output in standard calendar format
}




export const createRange = (start, stop) => {
    const range = []

    for (let i=start; i <=stop; i++) {
        range.push(i);
    }

    return range;
}
