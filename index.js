const express = require('express');
const myParser = require('body-parser')
const app = express();

const path = require('path');
let fetch = require('node-fetch');

const generatePassword = require('password-generator');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, '/client/build')));


/*
    Contents:
        ~30:  class Recipe
        ~50:  class User
        ~75:  function updateUsers()
        ~100: function updateRecipes()
        ~120: function removeRecipe(id)
        ~140: function removeRecipeFromUser(userID, recipeID)

        ~215: GET /newRecipe'
        ~220: GET /recipes/:recipeID'
        ~240: GET /recipes/user/:userID'
        ~270: POST /add/user/:userName/:userID/:email'
        ~285: POST /newRecipe'
        ~355: PUT /recipes/update/:recipeID'
        ~425: DELETE /recipes/remove/:recipeID'
*/





//Primary recipe object
class Recipe {
    constructor(recipeID, authorID, name, category, cuisine, difficulty, ingredients, instructions, cookTime, vegetarian, vegan, glutenFree, rating) {
        this.recipeID = recipeID; //String
        this.authorID = authorID; //String
        this.name = name; //String
        this.category = category; //String
        this.cuisine = cuisine; //String
        this.difficulty = difficulty; //String
        this.ingredients = ingredients; //String of ingredients (To be changed later)
        this.instructions = instructions; //String (maybe array?)
        this.cookTime = cookTime; //String
        this.vegetarian = vegetarian; //Boolean
        this.vegan = vegan; //Boolean
        this.glutenFree = glutenFree; //Boolean
        // this.rating = rating; //Object with ratings and comments
    }
}

class User {
    constructor(id, name, email, recipePosts) {
        this.id = id; //String
        this.name = name; //String
        this.email = email; //String
        this.recipePosts = recipePosts; //Store integers of the post IDs they currently own
        //this.recipes = []; //Array of RecipePost objects
    }
}

const firebase = require("firebase");
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDdiRz7i8b8ERm2kNPq59X1aTnyesRjr64",
    authDomain: "recipe-app-4509.firebaseapp.com",
    databaseURL: "https://recipe-app-4509.firebaseio.com",
    projectId: "recipe-app-4509",
    storageBucket: "recipe-app-4509.appspot.com",
    messagingSenderId: "491235211599"
};
firebase.initializeApp(config);

let database = firebase.app().database().ref();
let userDatabase = database.child('Users');
let recipeDatabase = database.child('Recipes');

function updateUsers() { //load users from firebase to userArray
    // console.log('updating users from database...')
    userDatabase.once('value', function(snap) {
        snap.forEach(function(childSnap) {
            let userNode = new User(childSnap.val().userinfo.id, childSnap.val().userinfo.name, childSnap.val().userinfo.email, childSnap.val().userinfo.recipePosts);
            let newEntry = true;
            for (var usrIndex = 0; usrIndex < userArray.length; usrIndex++) {
                if (userArray[usrIndex].id == userNode.id) {
                    // console.log('updating user entry...');
                    userArray[usrIndex] = userNode;
                    newEntry = false;
                    break;
                }
            }
            if (newEntry) {
                // console.log('creating user entry...');
                userArray[userArray.length] = userNode;
            }
        });
    });
    // console.log('done!');
}

function updateRecipes() { //load recipes from firebase into recipeArray
    // console.log('updating recipes from database...');
    recipeDatabase.once('value', function(snap) {
        snap.forEach(function(childSnap) {
            let recipeNode = new Recipe(childSnap.val().recipe.recipeID, childSnap.val().recipe.authorID, childSnap.val().recipe.name, childSnap.val().recipe.category, childSnap.val().recipe.cuisine, childSnap.val().recipe.difficulty, childSnap.val().recipe.ingredients, childSnap.val().recipe.instructions, childSnap.val().recipe.cookTime, childSnap.val().recipe.vegetarian, childSnap.val().recipe.vegan, childSnap.val().recipe.glutenFree, childSnap.val().recipe.rating);
            let newEntry = true;
            for (var rcpIndex = 0; rcpIndex < recipeArray.length; rcpIndex++) {
                if (recipeArray[rcpIndex].recipeID == recipeNode.recipeID) {
                    // console.log('updating recipe entry...');
                    recipeArray[rcpIndex] = recipeNode;
                    newEntry = false;
                    break;
                }
            }
            if (newEntry) {
                // console.log('creating recipe entry...');
                recipeArray[recipeArray.length] = recipeNode;
            }
        });
    });
    // console.log('done!');
}

// removes the recipe from recipeArray and returns the authorID
function removeRecipe(id) {
    // console.log('Removing Recipe...');
    let authorID = null;
    for (var index = 0; index < recipeArray.length; index++) {
        if (id == recipeArray[index].recipeID) {
            // console.log(recipeArray);
            // console.log('Found!  removing...');
            authorID = recipeArray[index].authorID;
            recipeArray.splice(index, 1);
            // console.log(recipeArray);
            // console.log('...done!');
            break;
        }
    }
    // console.log('id:' + authorID);
    return authorID;
}

//Removes recipe from user's array of recipes on database and in recipeArray
function removeRecipeFromUser(userID, recipeID) {
    // console.log('searching for user with id ' + userID + '...');
    for (var usr = 0; usr < userArray.length; usr++) {
        if (userArray[usr].id == userID) {
            // console.log('...found!');
            let user = userArray[usr];
            // console.log('searching for recipe with id ' + recipeID + '...');
            for (var rcp = 0; rcp < user.recipePosts.length; rcp++) {
                if (user.recipePosts[rcp] == recipeID) {
                    // console.log('...found!');
                    // console.log('removing entry...');
                    user.recipePosts.splice(rcp, 1);
                    userDatabase.child(`${userID}`).update({
                        userinfo: user
                    });
                    // console.log('...done!');
                    return;
                }
            }
            // console.log('recipe not found!');
            return;
        }
    }
    // console.log('user not found!');
    return;
}

//var urlencodedparser = myParser.urlencoded({extended: false});
app.use(myParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(myParser.json());
//test data
let testUser = new User(8675309, 'Jenny27', 'tommy.tutone@hotmail.net', []);
let userArray = [];
userArray[0] = testUser;
let testRecipe = new Recipe(1, 'John Smith', 'Spaghetti and Meatballs', 'Dinner', 'Italian', 'Beginner', 'Here are a bunch of ingredients', '(1) Form meat into balls\n(2) Cook spaghetti\n(3) Slap it all together', 30, false, false, false, 5);
let recipeArray = [];
recipeArray[0] = testRecipe;

/* // let testSpaghetti = new Ingredient('Spaghetti', 200, 'g');
// let testBeef = new Ingredient('Beef', 100, 'g');
// let testSauce = new Ingredient('Tomato Sauce', 10, 'fl oz';
// let testIngredientArray = [];
// testIngredientArray[0] = testSpaghetti, testBeef, testSauce;
// let testRecipe = new Recipe(1, 'John Smith', 'Spaghetti and Meatballs', 'Dinner', 'Italian', 'Beginner', 'Here are a bunch of ingredients', '(1) Form meat into balls\n(2) Cook spaghetti\n(3) Slap it all together', 30, false, false, false, 5);
// let testReview = new Review(123456, testUser, 5, 'Very spice meatball.  Dont worry about why Im reviewing my own food');
// let testRecipePost = new RecipePost(696969, testRecipe, testUser, [testReview]);
// let recipeArray = [];
// recipeArray[0] = testRecipe; */

updateUsers(); //loads users from firebase into userArray
updateRecipes(); //loads recipePosts from firebase into recipeArray
/* ====== HELPFUL LINKS =======================
https://expressjs.com/en/guide/routing.html
https://www.npmjs.com/package/express-param
https://github.com/expressjs/express/issues/699
https://stackoverflow.com/questions/15134199/how-to-split-and-modify-a-string-in-nodejs
============================================= */


/*--------------------------------------------------------------------------*/
/*------------------------------ GET REQUESTS ------------------------------*/
/*--------------------------------------------------------------------------*/

//variable argument test
app.get('/newRecipe', function(req, res) {
    res.sendFile(__dirname + '/client/public/NewRecipe.html');
});

//  GET INDIVIDUAL RECIPE BY USING RECIPE ID
app.get('/recipes/:recipeID', function(req, res) {
    let recipeSearchID = Number(req.params.recipeID);
    // console.log(recipeSearchID);
    retRecipe = null;

    // Search the database for a recipe with matching ID
    recipeArray.map(RP => {
        if (RP.recipeID == recipeSearchID) {
            retRecipe = RP;
            res.send(JSON.stringify(retRecipe));
            return;
        }
    });

    if (retRecipe === null) {
        res.send('No recipes found with requested id');
    }
});

//  GET ALL RECIPES FOR SPECIFIED USER BY USING USER ID
app.get('/recipes/user/:userID', function(req, res) {
    let searchID = String(req.params.userID);
    let user = null;
    retRecipes = [];
    console.log('User ID: ' + searchID);
    //Search the recipe database for matching user ids
    userArray.map(usr => {
        if (usr.id == searchID) {
            user = usr;
        }
    });
    if (user === null) {
        res.send("User Not Found.");
        return;
    }
    recipeArray.map(recipe => {
        if (recipe.authorID == searchID) {
            retRecipes.push(recipe);
        }
    });

    if (retRecipes === []) {
        res.send('No recipes found for requested user id');
        return;
    }
    res.send(JSON.stringify(retRecipes));
});


/*--------------------------------------------------------------------------*/
/*----------------------------- POST REQUESTS ------------------------------*/
/*--------------------------------------------------------------------------*/

//  CREATE NEW USER ACCOUNT WITH NAME ID EMAIL BOOKPOSTS
app.post('/add/user/:userName/:userID/:email', function(req, res) {
    let id = String(req.params.userID);
    let name = String(req.params.userName);
    let email = String(req.params.email);

    userArray[userArray.length] = new User(id, name, email, []);
    database.child('Users/' + `${id}`).set({ //store into firebase
        userinfo: userArray[userArray.length - 1]
    });
    res.send(userArray[userArray.length - 1]);
});

//  CREATE AND POST A NEW RECIPE
app.post('/newRecipe', function(req, res) {
    let recipeTitle = String(req.body.name);
    let recipeID = String(req.body.recipeID);
    let authorID = String(req.body.authorID);
    let category = String(req.body.category);
    let cuisine = String(req.body.cuisine);
    let difficulty = String(req.body.difficulty);
    let ingredients = String(req.body.ingredients);
    let instructions = String(req.body.instructions);
    let cookTime = String(req.body.cookTime);
    let vegetarian = false;
    let vegan = false;
    let glutenFree = false;

    // dummy placeholder
    let rating = 5;
    if (req.body.vegetarian == "TRUE") {
        vegetarian = true;
    };
    if (req.body.vegan == "TRUE") {
        vegan = true;
    };
    if (req.body.glutenFree == "TRUE") {
        glutenFree = true;
    };
    let user = null;
    userArray.map(usr => {
        if (usr.id == authorID) {
            user = usr;
        }
    });
    if (user === null) {
        res.send("User not found");
        return;
    }
    // console.log(recipeArray[recipeArray.length - 1].recipeID);
    // console.log(recipeArray + ' ' + recipeArray.length);
    //Careful with below...might prove to contain an error if recipeArray empty

    let recipeIndex = recipeArray[recipeArray.length - 1].recipeID + 1; //add 1 to most recent recipe so all recipeIds are unique
    recipeArray[recipeArray.length] = new Recipe(recipeIndex, authorID, recipeTitle, category, cuisine, difficulty, ingredients, instructions, cookTime, vegetarian, vegan, glutenFree, rating);

    if (user.recipePosts == null) {
        user.recipePosts = [recipeIndex];
    } else {
        user.recipePosts[user.recipePosts.length] = recipeIndex;
    }
    // console.log(recipeIndex);
    database.child('Recipes/' + `${recipeIndex}`).set({
        recipe: recipeArray[recipeArray.length - 1]
    });
    database.child('Users/' + `${user.id}`).update({
        userinfo: user
    });

    updateUsers();
    updateRecipes();
    // console.log(userArray);
    // console.log(recipeArray);
    res.send(recipeArray[recipeArray.length - 1]);

    // res.sendFile(__dirname + '/client/public/NewRecipe.html')
});


/*--------------------------------------------------------------------------*/
/*------------------------------ PUT REQUESTS ------------------------------*/
/*--------------------------------------------------------------------------*/

// UPDATE INDIVIDUAL RECIPE BY USING RECIPE ID
app.put('/recipes/update/:recipeID', function(req, res) {
    let selectedRecipe = null;
    recipeID = req.params.recipeID;
    for (var rcp = 0; rcp < recipeArray.length; rcp++) {
        if (recipeArray[rcp].recipeID == recipeID) {
            selectedRecipe = recipeArray[rcp];
            break;
        }
    }
    if (selectedRecipe == null) {
        res.send('could not find recipe with id ' + recipeID);
        return;
    }

    // these seem redundant but better safe than sorry
    if (req.body.name != null) {
        selectedRecipe.name = req.body.name;
    }
    if (req.body.category != null) {
        selectedRecipe.category = req.body.category;
    }
    if (req.body.cuisine != null) {
        selectedRecipe.cuisine = req.body.cuisine;
    }
    if (req.body.difficulty != null) {
        selectedRecipe.difficulty = req.body.difficulty;
    }
    if (req.body.ingredients != null) {
        selectedRecipe.ingredients = req.body.ingredients;
    }
    if (req.body.instructions != null) {
        selectedRecipe.instructions = req.body.instructions;
    }
    if (req.body.cookTime != null) {
        selectedRecipe.cookTime = req.body.cookTime;
    }
    if (req.body.vegetarian != null) {
        if (req.body.vegetarian == "TRUE") {
            selectedRecipe.vegetarian = true;
        } else {
            selectedRecipe.vegetarian = false;
        }
    }
    if (req.body.vegan != null) {
        if (req.body.vegan == "TRUE") {
            selectedRecipe.vegan = true;
        } else {
            selectedRecipe.vegan = false;
        }
    }
    if (req.body.glutenFree != null) {
        if (req.body.glutenFree == "TRUE") {
            selectedRecipe.glutenFree = true;
        } else {
            selectedRecipe.glutenFree = false;
        }
    }
    recipeArray[rcp] = selectedRecipe;
    database.child('Recipes/' + `${selectedRecipe.recipeID}`).update({
        recipe: selectedRecipe
    });
    res.send(selectedRecipe);
});


/*--------------------------------------------------------------------------*/
/*---------------------------- DELETE REQUESTS -----------------------------*/
/*--------------------------------------------------------------------------*/

//  DELETE RECIPE BY USING RECIPE ID
app.delete('/recipes/remove/:recipeID', function(req, res) {
    // console.log(req.params);
    let recipeID = Number(req.params.recipeID)
    // console.log(recipeID);
    let authorID = removeRecipe(recipeID);
    // console.log('Author ID: ' + authorID);
    // console.log('Recipe ID: ' + recipeID);
    if (authorID != null) {
        database.child('Recipes/' + `${recipeID}`).remove();
        console.log('recipe removed from firebase!');
        removeRecipeFromUser(authorID, recipeID);
        res.send("Done");
        // need to find a way to remove value from user's list of posts
    } else { //author ID is null...
        // console.log('recipe not found');
        res.send("YOU F*CKED UP");
    }
    return;

    // Removing the recipe from the user's recipePosts
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});