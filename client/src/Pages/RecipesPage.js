import React, {
    Component
} from 'react';
import Recipes from '../Components/Recipes/Recipes';
// import NavBar from '../Components/NavBar/NavBar';
import './styles.css';
// import uuid from 'uuid';

class RecipesPage extends Component {

    constructor(props) {
        super(props)
        this.handleViewRecipe = this.handleViewRecipe.bind(this);
        this.state = {
            // This will need to be changed to work with authorization
            userID: '',
            recipesLoaded: 'False',
            recipes: [],
            currentRecipe: 'Test'
        }
    }

    getRecipes() {
        // console.log('Inside RecipesPage.js: ');
        // console.log(this.props.currentUserID);
        // console.log(this.state.userID);
        fetch(`/recipes/user/${this.props.currentUserID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            // console.log('Success: ' + result);
            this.setState({
                recipesLoaded: 'True',
                recipes: result
            })
        }).catch((error) => {
            console.log('Error: ' + error);
        });
    }

    componentDidMount() {
        // console.log('in recipespage.js: ');
        // console.log(this.props.currentUserID);
        this.setState({
            userID: this.props.currentUserID
        })
        this.getRecipes();
    }

    handleDeleteRecipe(id) {
        // id.preventDefault();
        console.log('trying to delete');
        fetch(`/recipes/remove/${id}`, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res);
            // Currently you must refresh the page after deleting something...
            // let recipes = this.state.recipes;
            // let index = recipes.findIndex(x => x.id === id);
            // recipes.splice(index, 1);
            // this.setState({
            //     recipes: recipes
            // })
        });
    }

    handleViewRecipe(id) {
        fetch(`/recipes/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            console.log('Success: ' + result);
            // this.setState({
            //     currentRecipe: result
            // })
        }).catch((error) => {
            console.log('Error: ' + error);
        });
        // console.log(this);
        this.props.history.push('/recipes/view');
    }

    render() {
        return (<div className = "bodyStyle">
            {/* <NavBar/> */}
            <br/>
            <Recipes recipes={this.state.recipes} onDelete={this.handleDeleteRecipe.bind(this.state.recipes.recipeID)} onView={this.handleViewRecipe.bind(this.state.recipes.recipeID)}/>
        </div>);
    }
}

export default RecipesPage;