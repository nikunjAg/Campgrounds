var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {

    console.log("Connected");
    // Schema
    var Schema = mongoose.Schema;
    var dogSchema = new Schema({
        name: String,
        age: Number
    });

    dogSchema.methods.makeSound = function(){
        return 'Woof!';
    };

    var Dog = mongoose.model('Dog', dogSchema);

    var dog = new Dog({ name: "Fluffy2", age: 10 });

    // Add a new document to the collection
    // dog.save((err, dog)=> {
    //     if (err) return console.log('Error: ' + err);
    //     console.log(dog);
    // });

    // find -> find() -> (return an array), findOne() ->  (return a single first matched document)

    // Dog.findOne({age: 10}, (err, dog)=> {
    //     if ( err ) return console.log( 'Error: ' + err );
    //     if ( !dog ) return console.log( 'No such dog exists' );
    //     console.log(dog.makeSound(), dog);
    // });

    // findById()
    // Dog.findById(new ObjectId('5cfa6fcc01fc2a198c621e49'), (err, dog) => {
    //     if ( err ) return console.log('Error: ' + err);
    //     if( !dog ) return console.log( 'Such dog do not exists.' );
    //     console.log(dog);
    // });

    // Using chaining Deprecated
    // Dog.findOne({name: "My fluffy"}).update({
    //     $set: {
    //         name: "Fluffy"
    //     }
    // }, function(err, row) {
    //     if( err ) return console.log('Error: ' + error);
    //     console.log('Rows affected: ' + JSON.stringify(row, undefined, 2));
    // });
    // rowsObject { n, nModified, ok }

    // Deprecated
    // Dog.update({ name: "Fluffy" }, {
    //     $set: {
    //         age: 13
    //     }
    // }, function(err, dog) {
    //     if ( err ) return console.log("Error: " + err);
    //     if ( !dog ) return console.log("No such dog exists");
    //     console.log(dog);
    // });

    // Dog.updateOne( {name: "Fluffy"} , {
    //     $set: {
    //         age: 10
    //     }
    // }, function(err, dog) {
    //     if ( err ) return console.log("Error: " + err);
    //     if ( !dog ) return console.log("No such dog exists");
    //     console.log(dog);
    // });

    // Dog.updateMany( {name: "Fluffy"} , {
    //     $set: {
    //         age: 5
    //     }
    // }, function(err, dogs) {
    //     if ( err ) return console.log("Error: " + err);
    //     if ( !dog ) return console.log("No such dog exists");
    //     console.log(dogs);
    // });


    // Dog.findOneAndUpdate( {name: "Fluffy"} , {
    //     $set: {
    //         age: 1
    //     }
    // }, function(err, dogs) {
    //     if ( err ) return console.log("Error: " + err);
    //     if ( !dog ) return console.log("No such dog exists");
    //     console.log(dogs);
    // });

    // Dog.findOneAndDelete({name: "Fluffy1"}, (err, dog) => {
    //     console.log(dog);
    // });
    Dog.create({ name: "Fluffy", age: 4 }, function(err, dog){
        if ( err ) return console.log("Error: " + err);
        if ( !dog ) return console.log("No such dog exists");
        console.log(dog);
    });

    // Dog.findOneAndDelete

});