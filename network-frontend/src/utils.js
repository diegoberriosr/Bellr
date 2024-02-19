import moment from 'moment'

const formatDate = (post) => {

    const difference = moment().utc().diff(post.timestamp, 'days'); // Check the time distance between current time and the post's timestamp

    if (difference < 7) { // Output result in 'X time ago') if difference is less than 7 days
        return moment.utc(post.timestamp).fromNow();
    }

    return moment.utc(post.timestamp).format('YYYY-MM-DD'); // Otherwise output in standard calendar format
}

export default formatDate;
