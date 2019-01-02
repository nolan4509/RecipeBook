import React, {
    Component
} from 'react';
import './NewRecipe.css';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

require('firebase/auth');
// import uuid from 'uuid';

class NewRecipe extends Component {
    constructor(props) {
        super(props);
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeCategory = this.handleChangeCategory.bind(this)
        this.handleChangeCuisine = this.handleChangeCuisine.bind(this)
        this.handleChangeDifficulty = this.handleChangeDifficulty.bind(this)
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this)
        this.handleChangeInstructions = this.handleChangeInstructions.bind(this)
        this.handleChangeCookTime = this.handleChangeCookTime.bind(this)
        this.handleChangeVegetarian = this.handleChangeVegetarian.bind(this)
        this.handleChangeVegan = this.handleChangeVegan.bind(this)
        this.handleChangeGlutenFree = this.handleChangeGlutenFree.bind(this)
        this.state = {
            newRecipe: {},
            name: '',
            authorID: '',
            category: 'Breakfast',
            cuisine: 'American',
            difficulty: 'Easy',
            ingredients: '',
            instructions: '',
            cookTime: '',
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            complete: false,
            submissionStatus: '',
            user: null,
            isUploading: false,
            progress: 0,
            recipeImage: '',
            recipeImageURL: ''
        }
    }

    static defaultProps = {
        categories: [
            'Breakfast', 'Lunch', 'Dinner'
        ],
        cuisines: [
            'American', 'Asian', 'Mexican', 'Other'
        ],
        difficulties: ['Easy', 'Medium', 'Difficult']
    }


    postRecipe = (e) => {
        e.preventDefault()
        //this.target.reset()
        this.setState({
            complete: false
        })
        let reqBody = {
            name: this.state.name,
            authorID: this.state.authorID,
            category: this.state.category,
            cuisine: this.state.cuisine,
            difficulty: this.state.difficulty,
            ingredients: this.state.ingredients,
            instructions: this.state.instructions,
            cookTime: this.state.cookTime,
            vegetarian: this.state.vegetarian,
            vegan: this.state.vegan,
            glutenFree: this.state.glutenFree
        }
        console.log('Recipe Name: ' + this.state.name)
        fetch('/newRecipe', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(reqBody)
        }).then((res) => {
            this.setState({
                submissionStatus: 'New Recipe Created!'
            })
            return res.json();
        }).then((json) => {
            console.log('Success: ' + json);
        }).catch((error) => {
            console.log('Error: ' + error);
        });
        // e.preventDefault()
        //this.props.history.push("/home")
    }


    //See about making the JSX below not require these functions...
    //onChange={this.handleChangeName} --> onChange={this.setState({name: event.target.value})}
    handleChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    handleChangeCategory(event) {
        this.setState({
            category: event.target.value
        })
    }

    handleChangeCuisine(event) {
        this.setState({
            cuisine: event.target.value
        })
    }

    handleChangeDifficulty(event) {
        this.setState({
            difficulty: event.target.value
        })
    }

    handleChangeIngredients(event) {
        this.setState({
            ingredients: event.target.value
        })
    }

    handleChangeInstructions(event) {
        this.setState({
            instructions: event.target.value
        })
    }

    handleChangeCookTime(event) {
        this.setState({
            cookTime: event.target.value
        })
    }

    handleChangeVegetarian(event) {
        this.setState({
            vegetarian: event.target.value
        })
    }

    handleChangeVegan(event) {
        this.setState({
            vegan: event.target.value
        })
    }

    handleChangeGlutenFree(event) {
        this.setState({
            glutenFree: event.target.value
        })
    }

    componentDidMount() {
        var uid = localStorage.getItem("uid")
        if (uid) {
            console.log('Success!  uid: ' + uid);
            this.setState({
                authorID: uid
            });
        } else {
            console.log('Nobody is signed in!');
        }
    }

    handleUploadStart = () => this.setState({
        isUploading: true,
        progress: 0
    });

    handleProgress = (progress) => this.setState({
        progress
    });

    handleUploadError = (error) => {
        this.setState({
            isUploading: false
        })
        console.error(error);
    }

    handleUploadSuccess = (filename) => {
        this.setState({
            recipeImage: filename,
            progress: 100,
            isUploading: false
        });
        firebase.storage().ref("images").child(filename).getDownloadURL()
            .then(url => this.setState({
                recipeImageURL: url
            }));
    };


    render() {
        let categoryOptions = this.props.categories.map(category => {
            return <option key={category} value={category}>{category}</option>
        });
        let cuisineOptions = this.props.cuisines.map(cuisine => {
            return <option key={cuisine} value={cuisine}>{cuisine}</option>
        });
        let difficultyOptions = this.props.difficulties.map(difficulty => {
            return <option key={difficulty} value={difficulty}>{difficulty}</option>
        });

        // const {
        //     complete
        // } = this.state

        return (<div className="backgroundStyle">
            <div className="newRecipeHeader">Add a New Recipe!</div>
            <form id="newRecipeForm" onSubmit={this.postRecipe}>
                <div className="notebookPage">
                    {/* <Prompt when={!complete} message={location => (`Are you sure you want to go to ${location.pathname} before finishing your recipe post?`)}/> */}
                    <div className="newRecipeFormContent">
                        <div className="newRecipeTitleField">
                            <label htmlFor="newRecipeTitleField">Name:</label>
                            <input type="text" id="newRecipeTitleField" name="newRecipeTitleField" value={this.state.name} onChange={this.handleChangeName}/>
                        </div>
                        <div className="newRecipeImageUpload">
                            <label>Image: </label>
                            {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                            {this.state.recipeImageURL && <img src={this.state.recipeImageURL} />}
                            <FileUploader
                                accept="image/*"
                                name="recipeImage"
                                randomizeFilename
                                storageRef={firebase.storage().ref("images")}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress}/>
                        </div>
                        <div className="newRecipeDifficultyAndTimeLine">
                            <div className="newRecipeDifficultyField">
                                <label htmlFor="newRecipeDifficultyField">Difficulty</label><br/>
                                <select ref="difficulty" id="newRecipeDifficultyField" name="newRecipeDifficultyField" value={this.state.difficulty} onChange={this.handleChangeDifficulty}>
                                    {difficultyOptions}
                                </select>
                            </div>
                            <div className="newRecipeCookTimeField">
                                <label htmlFor="newRecipeCookTimeField">Cook Time</label><br/>
                                <input type="text" ref="cookTime" id="newRecipeCookTimeField" name="newRecipeCookTimeField" value={this.state.cookTime} onChange={this.handleChangeCookTime}/>
                            </div>
                        </div>
                        <div className="newRecipeCategoryAndCuisineLine">
                            <div className="newRecipeCategoryField">
                                <label htmlFor="newRecipeCategoryField">Category</label><br/>
                                <select ref="category" id="newRecipeCategoryField" name="newRecipeCategoryField" value={this.state.category} onChange={this.handleChangeCategory}>
                                    {categoryOptions}
                                </select>
                            </div>
                            <div className="newRecipeCuisineField">
                                <label htmlFor="newRecipeCuisineField">Cuisine</label><br/>
                                <select ref="cuisine" id="newRecipeCuisineField" name="newRecipeCuisineField" value={this.state.cuisine} onChange={this.handleChangeCuisine}>
                                    {cuisineOptions}
                                </select>
                            </div>
                        </div>
                        <div className="newRecipeIngredientsField">
                            <label htmlFor="newRecipeIngredientsField">Ingredients</label><br/>
                            <textarea ref="ingredientArray" id="newRecipeIngredientsField" name="newRecipeIngredientsField" rows="4" cols="30" value={this.state.ingredients} onChange={this.handleChangeIngredients}/>
                        </div>
                        <div className="newRecipeInstructionsField">
                            <label htmlFor="newRecipeInstructionsField">Instructions</label><br/>
                            <textarea ref="instructions" id="newRecipeInstructionsField" name="newRecipeInstructionsField" rows="4" cols="30" value={this.state.instructions} onChange={this.handleChangeInstructions}/>
                        </div>
                        <div className="newRecipeCheckBoxesLine">
                            <div className="newRecipeVegetarianField">
                                <label htmlFor="newRecipeVegetarianField">Vegetarian</label><br/>
                                <input type="checkbox" ref="vegetarian" id="newRecipeVegetarianField" name="newRecipeVegetarianField" value={this.state.vegetarian} onChange={this.handleChangeVegetarian}/>
                            </div>
                            <div className="newRecipeVeganField">
                                <label htmlFor="newRecipeVeganField">Vegan</label><br/>
                                <input type="checkbox" ref="vegan" id="newRecipeVeganField" name="newRecipeVeganField" value={this.state.vegan} onChange={this.handleChangeVegan}/>
                            </div>
                            <div className="newRecipeGlutenFreeField">
                                <label htmlFor="newRecipeGlutenFreeField">Gluten Free</label><br/>
                                <input type="checkbox" ref="glutenFree" id="newRecipeGlutenFreeField" name="newRecipeGlutenFreeField" value={this.state.glutenFree} onChange={this.handleChangeGlutenFree}/>
                            </div>
                        </div>
                        <br/>
                        <button id="newRecipeButton" className="newRecipeButton" form="newRecipeForm" type="submit">Submit</button>
                        <h3>{this.state.submissionStatus}</h3>
                    </div>
                </div>
            </form>
            </div>);
    }
}

// NewRecipe.propTypes = {
//     categories: React.PropTypes.array,
//     newRecipe: React.PropTypes.func
// }

export default NewRecipe;

/*  From Textbook App
postBook = () => {
    this.preventDefault()
    this.target.reset()
    this.setState({
        complete: false
    })
    console.log('courseCode = ' + this.state.courseCode)
    console.log('courseLevel = ' + this.state.courseLevel)
    console.log('course = ' + this.state.course)
    fetch(`/user/${this.state.userID}/books/newBook/${this.state.isbn}/${this.state.condition}/${this.state.teacher}/${this.state.courseCode}/${this.state.course.substr(-3)}/${this.state.price}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(this.setState({
        submissionStatus: `Post successfully created`
    }))
        .catch((ex) => {
        console.log('parsing failed', ex)
    })
    this.props.history.push("/sellerHub")
}
*/