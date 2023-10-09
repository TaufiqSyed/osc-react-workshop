import { useEffect, useState } from 'react'
import axios from 'axios'

const recipeData = [
  {
    title: '5-Ingredient Chili',
    description:
      'My father and I created this easy 5-ingredient chili recipe and everyone we have made it for loved it. It is fast, simple, and delicious.',
    ingredients: [
      '1 pound lean ground beef',
      '15 ounces tomato sauce',
      '1 (15 ounce) can kidney beans, drained',
      '1 (15 ounce) can chili beans, not drained',
      '2 tablespoons chili powder, or to taste',
    ],
    steps: [
      'Heat a large skillet over medium-high heat. Cook and stir ground beef  in the hot skillet until browned and crumbly, 5 to 7 minutes.',
      'Stir in kidney beans, chili beans, and tomato sauce. Bring to a boil and stir in chili powder. Reduce heat to a simmer, and cook, stirring occasionally, until thickened, about 15 minutes. Season to taste with salt and pepper.',
    ],
    imageUrl:
      'https://www.allrecipes.com/thmb/ScTPp8ols58UrSl4FRg1r5r5Eek=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/easy-5-ingredient-chili-recipe-7508143Paula4x3-a36649ee9ec04d44a2591d1467d77e50.jpg',
  },
]

function TextInput({ placeholder, value, setValue }) {
  return (
    <div>
      <input
        type='text'
        name={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
    </div>
  )
}

function AddRecipe({ addRecipeToList }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [imageUrl, setImageUrl] = useState('')

  const [addIngredient, setAddIngredient] = useState('')
  const [addStep, setAddStep] = useState('')

  function addIngredientToList(e) {
    e.preventDefault()
    setIngredients([...ingredients, addIngredient])
    setAddIngredient('')
  }
  function addStepToList(e) {
    e.preventDefault()
    setSteps([...steps, addStep])
    setAddStep('')
  }

  function addRecipe(e) {
    e.preventDefault()

    addRecipeToList(title, description, ingredients, steps, imageUrl)
    setTitle('')
    setDescription('')
    setIngredients([])
    setSteps([])
    setImageUrl('')
    setAddIngredient('')
    setAddStep('')
  }

  return (
    <div
      style={{
        border: '3px solid black',
        borderRadius: '14px',
        padding: '15px 20px 30px 20px',
        marginBottom: '20px',
      }}
    >
      <form>
        <h4>Add Recipe</h4>
        <TextInput placeholder='title' value={title} setValue={setTitle} />
        <TextInput
          placeholder='description'
          value={description}
          setValue={setDescription}
        />
        <br />
        <h6>Ingredients:</h6>
        <ul>
          {ingredients.map((ingredient, idx) => {
            return <li>{ingredient}</li>
          })}
        </ul>
        <TextInput
          placeholder='addIngredient'
          value={addIngredient}
          setValue={setAddIngredient}
        />
        <button onClick={addIngredientToList}>Add Ingredient</button>
        <br />
        <h6>Steps:</h6>
        <ol>
          {steps.map((step, idx) => {
            return <li>{step}</li>
          })}
        </ol>
        <TextInput
          placeholder='addStep'
          value={addStep}
          setValue={setAddStep}
        />
        <button onClick={addStepToList}>Add Step</button>
        <TextInput
          placeholder='imageUrl'
          value={imageUrl}
          setValue={setImageUrl}
        />
        <button onClick={addRecipe}>Add Recipe</button>
      </form>
    </div>
  )
}

// recipe: title, description, ingredients, steps, imageUrl,
function Recipe({ title, description, ingredients, steps, imageUrl }) {
  return (
    <div
      style={{
        boxShadow:
          'box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);',
        padding: '12px',
      }}
    >
      <p>{title}</p>
      <p>{description}</p>
      <ul>
        {ingredients.map((ingredient, idx) => {
          return <li key='idx'>{ingredient}</li>
        })}
      </ul>
      <ol>
        {steps.map((step, idx) => {
          return <li key='idx'>{step}</li>
        })}
      </ol>
      <img src={imageUrl} height='256px' width='auto' />
    </div>
  )
}

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  async function createRecipe(
    title,
    description,
    ingredients,
    steps,
    imageUrl
  ) {
    try {
      await axios.post('http://localhost:3001/recipes', {
        title: title,
        description: description,
        ingredients: ingredients.join(';'),
        instructions: steps.join(';'),
        imageUrl: imageUrl,
      })
      await fetchRecipes()
    } catch (err) {
      console.error(err)
    }
  }
  function addRecipeToList(title, description, ingredients, steps, imageUrl) {
    const newRecipe = {
      title,
      description,
      ingredients,
      steps,
      imageUrl,
    }
    setRecipes([...recipes, newRecipe])
  }

  const fetchRecipes = async () => {
    try {
      const updatedRecipes = (await axios.get('http://localhost:3001/recipes'))
        .data
      console.log(JSON.stringify(updatedRecipes))
      setRecipes([
        ...updatedRecipes.map((e) => ({
          ...e,
          ingredients: e.ingredients.split(';'),
          steps: e.instructions.split(';'),
        })),
      ])
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 style={{ fontSize: '48px' }}>🍲 The AUS Kitchen </h1>
        <p>
          Our mission is to provide AUS dorm students with the easiest and
          healthiest recipes they can cook!
        </p>
        <AddRecipe addRecipeToList={createRecipe} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          recipes.map((recipe) => {
            return (
              <Recipe
                title={recipe.title}
                description={recipe.description}
                ingredients={recipe.ingredients}
                steps={recipe.steps}
                imageUrl={recipe.imageUrl}
              />
            )
          })
        )}
      </header>
    </div>
  )
}

export default App
