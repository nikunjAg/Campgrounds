const mongoose      = require('mongoose'),
      ObjectId      = mongoose.Types.ObjectId,
      {Campground}  = require('./models/Campground'),
      {Comment}     = require('./models/Comment'),
      seedData      = [
        {
            image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            name: "Seed Title",
            caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel eleifend justo, in commodo ex. Nulla facilisi. Sed at tempus tortor. Sed quis dictum quam, sed interdum libero. Sed erat elit, pharetra non orci at, consectetur sollicitudin urna. Cras cursus posuere nisl ut convallis. Nulla sodales cursus sem eget faucibus. Duis interdum ligula id odio accumsan, vitae volutpat felis fermentum. Donec pellentesque sagittis nulla, eget sollicitudin nisi congue vel.",
            author: {
                id: new ObjectId(),
                username: 'Seed User'
            }
        },
        {
            image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            name: "Seed Title 1",
            caption: "Seed Caption! 1",
            author: {
                id: new ObjectId(),
                username: 'Seed User 1'
            }
        },
        {
            image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            name: "Seed Title 2",
            caption: "Seed Caption! 2",
            author: {
                id: new ObjectId(),
                username: 'Seed User 2'
            }
        }
      ];


module.exports = function(){

    // Remove all the campgrounds
    Campground.deleteMany({}, function(err){

        if(err) return console.log(err);
        console.log('Removed All Campgrounds');

        // Remove all the comments
        Comment.deleteMany({}, function(err){
            if(err) return console.log('Error: ' + err);

            console.log('All Comments Deleted');
            // Add new Campgrounds
            Campground.create(seedData, function(err, campgrounds){
                if(err) return console.log("Error: " + err);
                console.log('New Campgrounds Added');

                // Add new Comments
                campgrounds.forEach(campground => {
                    Comment.create({
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel eleifend justo, in commodo ex. Nulla facilisi. Sed at tempus tortor. ",
                        author: { id: new ObjectId(), username: 'Seed User' }
                    }, function(err, comment) {
                        if(err) return console.log('Error: ' + err);
                        campground.comments.push(comment._id);
                        campground.save(function(err, newCampground) {
                            if (err) return console.log("Error: " + err);
                            console.log('Campground With Comments: ' + newCampground);
                        });
                    });
                });
            });
        });
    });
}