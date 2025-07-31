import { useNavigate } from 'react-router-dom';
import gym from '@/assets/Categories/gym.png'; 
import home from '@/assets/Categories/home.png';
import fat from '@/assets/Categories/fat.png';
import beginner from '@/assets/Categories/beginner.png';
import meals from '@/assets/Categories/meals.png';
import recipes from '@/assets/Categories/recipes.png';
import supplements from '@/assets/Categories/supplements.png';

const categories = [
  { 
    label: 'home-workouts',
    href: '/category/home-workouts',
    img: home,
    alt: 'Home Workouts',
    title: 'Home Workouts',
    desc: 'Effective routines you can do at home'
  },
  {
    label: 'gym-workouts',
    href: '/category/gym-workouts',
    img: gym,
    alt: 'Gym Workouts',
    title: 'Gym Workouts',
    desc: 'Intense workouts for gym enthusiasts'
  },
  {
    label: 'beginner',
    href: '/category/beginner',
    img: beginner,
    alt: 'Beginner Friendly',
    title: 'Beginner Friendly',
    desc: 'Start your fitness journey with ease'
  },
  {
    label: 'fat-burning',
    href: '/category/fat-burning',
    img: fat,
    alt: 'Fat Burning',
    title: 'Fat Burning',
    desc: 'High-intensity workouts to shed fat'
  },
  {
    label: 'meal-plans',
    href: '/category/meal-plans',
    img: meals,
    alt: 'Meal Plans',
    title: 'Meal Plans',
    desc: 'Structured meal plans for optimal nutrition'
  },
  {
    label: 'recipes',
    href: '/category/recipes',
    img: recipes,
    alt: 'Healthy Recipes',
    title: 'Healthy Recipes',
    desc: 'Delicious recipes for a healthy lifestyle'
  },
  {
    label: 'supplements',
    href: '/category/supplements',
    img: supplements,
    alt: 'Supplements',
    title: 'Supplements',
    desc: 'Guides on effective supplements'
  }
];

function CategorySection() {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-[#1a1a1a] text-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore Categories</h2>
          <p className="text-xl text-white/70">
            Find content tailored to your interests and fitness level
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <button
              onClick={() => navigate(category.href)}
              className="group text-left w-full"
              key={category.label}
              title={category.title}
            >
              <div className="bg-[#212121] rounded-lg p-6 text-center shadow-md transition transform hover:shadow-xl hover:-translate-y-1">
                <img
                  src={category.img}
                  alt={category.alt}
                  className="mx-auto mb-4 w-56 h-56 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="text-xl font-semibold mb-2 transition group-hover:text-[#cfff6a]">
                  {category.title}
                </h3>
                <p className="text-white/70">{category.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
