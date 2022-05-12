const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                console.log(_id);
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // add the comment's _id to the specific pizza we want to update using the $push method
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!'});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove comment
    removeComment({ params }, res) {
        // delete data whild also returning its data using findOneAndDelete() method
        Comment.findOneAndDelete({ id_: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment found with this id!'});
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // take data and use it to identify and remove it from the associated pizza using the $pull method
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // add reply
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params, body}, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // $pull operator used to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
};

module.exports = commentController;