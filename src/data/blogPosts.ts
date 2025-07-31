import homeWorkoutImg from '@/assets/home-workout.jpg';
import gymWorkoutImg from '@/assets/gym-workout.jpg';
import nutritionMealImg from '@/assets/nutrition-meal.jpg';
import beginnerFitnessImg from '@/assets/beginner-fitness.jpg';
import cardioWorkoutImg from '@/assets/cardio-workout.jpg';
import healthyRecipesImg from '@/assets/healthy-recipes.jpg';

import { CategoryLabel } from '@/lib/constants';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  fullContent: string;
  readTime: string;
  image: string;
  categories: CategoryLabel[];
  href: string;
  publishedAt?: string;
}

// This would typically come from an API
import axios from 'axios';

export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const res = await axios.get('http://localhost:1337/api/articles?populate=*');
    const posts = res.data.data;
    return posts.map((item: any) => {
      // Strapi v4: data is at root, not attributes
      // content is array of blocks, categories is comma string, coverImage is array
      const attrs = item;
      // Handle coverImage (array)
      let imageUrl = '';
      if (attrs.coverImage && Array.isArray(attrs.coverImage) && attrs.coverImage.length > 0) {
        const img = attrs.coverImage[0];
        imageUrl = img.url.startsWith('http')
          ? img.url
          : `http://localhost:1337${img.url}`;
      }
      // Handle content as HTML string
      let contentString = '';
      if (typeof attrs.content === 'string') {
        // If content is already HTML, use it directly
        contentString = attrs.content;
      } else if (Array.isArray(attrs.content)) {
        // Fallback: join all text blocks (legacy)
        contentString = attrs.content.map((block: any) => {
          if (block.type === 'paragraph' && Array.isArray(block.children)) {
            return block.children.map((child: any) => child.text).join('');
          }
          return '';
        }).join('\n\n');
      }
      // Handle categories (comma-separated string)
      let categoriesArr: string[] = [];
      if (typeof attrs.categories === 'string') {
        categoriesArr = attrs.categories.split(',').map((c: string) => c.trim());
      } else if (Array.isArray(attrs.categories)) {
        categoriesArr = attrs.categories;
      }
      return {
        id: String(attrs.id),
        title: attrs.title,
        content: contentString,
        fullContent: contentString,
        date: attrs.publishDate || attrs.createdAt || '',
        readTime: attrs.readTime || '',
        image: imageUrl,
        categories: categoriesArr,
        href: attrs.slug,
        publishedAt: attrs.publishedAt || attrs.publishDate || attrs.createdAt || '',
      };
    });
  } catch (err) {
    console.error('Failed to fetch posts from Strapi:', err);
    return [];
  }
};


// import homeWorkoutImg from '@/assets/home-workout.jpg';
// import gymWorkoutImg from '@/assets/gym-workout.jpg';
// import nutritionMealImg from '@/assets/nutrition-meal.jpg';
// import beginnerFitnessImg from '@/assets/beginner-fitness.jpg';
// import cardioWorkoutImg from '@/assets/cardio-workout.jpg';
// import healthyRecipesImg from '@/assets/healthy-recipes.jpg';

// import { CategoryLabel } from '@/lib/constants';

// export interface BlogPost {
//   id: string;
//   title: string;
//   content: string;
//   fullContent: string;
//   date: string;
//   readTime: string;
//   image: string;
//   categories: CategoryLabel[];  // Changed from single category to array of categories
//   href: string;
// }

// // This would typically come from an API
// export const getAllPosts = async (): Promise<BlogPost[]> => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 500));

//   return [
//     {
//       id: '1',
//       title: "Complete Home Workout Guide: No Equipment Needed",
//       content: "Transform your living room into a personal gym with these effective bodyweight exercises. Perfect for busy schedules and small spaces.",
//       date: "Jan 15, 2024",
//       readTime: "8 min read",
//       image: homeWorkoutImg,
//       categories: ["home-workouts", "beginner"],
//       href: "home-workout-guide",
//       fullContent: `
        // Transform your living room into a personal gym with these effective bodyweight exercises. Perfect for busy schedules and small spaces.

        // ## Getting Started
        // Before starting any workout routine, ensure you have enough space to move freely and wear comfortable clothing.

        // ## Workout Routine
        // 1. **Bodyweight Squats** - 3 sets of 15 reps
        // 2. **Push-ups** - 3 sets of 10 reps
        // 3. **Lunges** - 3 sets of 12 reps per leg
        // 4. **Plank** - 3 sets of 30 seconds
        // 5. **Mountain Climbers** - 3 sets of 30 seconds

        // ## Benefits
        // - No equipment needed
        // - Can be done anywhere
        // - Improves strength and flexibility
        // - Burns calories effectively
        // - Saves time and money

        // Remember to stay hydrated and listen to your body. If you feel any pain, stop and consult a healthcare professional.
//       `
//     },
//     {
//       id: '2',
//       title: "5 Essential Gym Exercises for Maximum Results",
//       content: "Master these fundamental movements to build strength, muscle, and endurance. A comprehensive guide for gym enthusiasts of all levels.",
//       date: "Jan 12, 2024",
//       readTime: "10 min read",
//       image: gymWorkoutImg,
//       categories: ["gym-workouts", "beginner"],
//       href: "essential-gym-exercises",
//       fullContent: `
//         Master these fundamental movements to build strength, muscle, and endurance. A comprehensive guide for gym enthusiasts of all levels.

//         ## The Essential Exercises

//         ### 1. Squats
//         - Perfect form is crucial
//         - Keep your chest up
//         - Drive through your heels
//         - 4 sets of 8-12 reps

//         ### 2. Deadlifts
//         - Start with lighter weights
//         - Keep your back straight
//         - Push through the floor
//         - 3 sets of 8-10 reps

//         ### 3. Bench Press
//         - Retract your shoulder blades
//         - Keep feet planted firmly
//         - Control the movement
//         - 4 sets of 8-12 reps

//         ## Safety First
//         Always warm up properly and start with lighter weights to perfect your form.
//       `
//     },
//     {
//       id: '3',
//       title: "Meal Prep Mastery: Healthy Recipes for the Week",
//       content: "Save time and eat better with these nutritious, make-ahead meals. Complete with shopping lists and storage tips.",
//       date: "Jan 10, 2024",
//       readTime: "12 min read",
//       image: nutritionMealImg,
//       categories: ["meal-plans", "recipes"],
//       href: "meal-prep-mastery",
//       fullContent: `
//         Save time and eat better with these nutritious, make-ahead meals. Complete with shopping lists and storage tips.

//         ## Weekly Meal Plan
//         - **Breakfast**: Overnight oats with fruits
//         - **Lunch**: Quinoa salad with chickpeas
//         - **Dinner**: Grilled chicken with steamed vegetables
//         - **Snacks**: Hummus with carrot sticks

//         ## Shopping List
//         - Oats, quinoa, chickpeas, chicken breast, mixed vegetables, fruits, hummus

//         ## Storage Tips
//         - Use airtight containers
//         - Label meals with dates
//         - Store in the fridge for up to 5 days

//         Meal prepping not only saves time but also helps you stick to your nutrition goals.
//       `
//     },
//     {
//       id: '4',
//       title: "Beginner's Guide to Starting Your Fitness Journey",
//       content: "Everything you need to know to start exercising safely and effectively. Build confidence and establish lasting healthy habits.",
//       date: "Jan 8, 2024",
//       readTime: "15 min read",
//       image: beginnerFitnessImg,
//       categories: ["beginner", "home-workouts"],
//       href: "beginner-fitness-guide",
//       fullContent: `
//         Everything you need to know to start exercising safely and effectively. Build confidence and establish lasting healthy habits.

//         ## Getting Started
//         - Set realistic goals
//         - Choose activities you enjoy
//         - Start slow and gradually increase intensity

//         ## Recommended Exercises
//         - Walking or jogging
//         - Bodyweight exercises (squats, push-ups)
//         - Stretching and flexibility routines

//         ## Tips for Success
//         - Stay consistent
//         - Track your progress
//         - Find a workout buddy for motivation
//       `
//     },
//     {
//       id: '5',
//       title: "HIIT Workouts: Burn Fat Fast with High-Intensity Training",
//       content: "Maximize your workout efficiency with these proven high-intensity interval training routines. Perfect for busy lifestyles.",
//       date: "Jan 5, 2024",
//       readTime: "7 min read",
//       image: cardioWorkoutImg,
//       categories: ["fat-burning", "home-workouts", "gym-workouts"],
//       href: "hiit-workouts",
//       fullContent: `
//         Maximize your workout efficiency with these proven high-intensity interval training routines. Perfect for busy lifestyles.

//         ## What is HIIT?
//         High-Intensity Interval Training (HIIT) alternates between short bursts of intense activity and rest or low-intensity periods.

//         ## Sample HIIT Routine
//         1. **Jumping Jacks** - 30 seconds
//         2. **Rest** - 15 seconds
//         3. **Burpees** - 30 seconds
//         4. **Rest** - 15 seconds
//         5. **High Knees** - 30 seconds
//         6. **Rest** - 15 seconds

//         Repeat the circuit 3-5 times depending on your fitness level.
//       `
//     },
//     {
//       id: '6',
//       title: "Power-Packed Smoothie Recipes for Post-Workout Recovery",
//       content: "Fuel your recovery with these nutrient-dense smoothies packed with protein, vitamins, and antioxidants.",
//       date: "Jan 3, 2024",
//       readTime: "6 min read",
//       image: healthyRecipesImg,
//       categories: ["recipes", "meal-plans"],
//       href: "recovery-smoothies",
//       fullContent: `
//         Fuel your recovery with these nutrient-dense smoothies packed with protein, vitamins, and antioxidants.

//         ## Top Smoothie Recipes
//         1. **Berry Blast**
//            - 1 cup mixed berries
//            - 1 banana
//            - 1 cup spinach
//            - 1 scoop protein powder
//            - 1 cup almond milk

//         2. **Green Power**
//            - 1 cup kale
//            - 1/2 avocado
//            - 1/2 cucumber
//            - Juice of 1 lemon
//            - 1 cup coconut water

//         Blend all ingredients until smooth and enjoy post-workout!
//       `
//     },
//     {
//       id: '7',
//       title: "Top 10 Tips for Staying Motivated on Your Fitness Journey",
//       content: "Discover effective strategies to keep your motivation high and achieve your fitness goals, no matter the obstacles.",
//       date: "Jan 1, 2024",
//       readTime: "5 min read",
//       image: homeWorkoutImg,
//       categories: ["home-workouts", "beginner"],
//       href: "motivation-tips",
//       fullContent: `
//         Discover effective strategies to keep your motivation high and achieve your fitness goals, no matter the obstacles.

//         ## Key Motivation Tips
//         1. **Set Clear Goals** - Define what you want to achieve.
//         2. **Track Your Progress** - Keep a journal or use apps to monitor improvements.
//         3. **Find a Workout Buddy** - Exercising with a friend can boost accountability.
//         4. **Mix It Up** - Try new workouts to keep things interesting.
//         5. **Reward Yourself** - Celebrate milestones with non-food rewards.

//         Remember, consistency is key. Stay focused and keep pushing forward!
//       `
//     },  
//     // Add more posts here...
//   ];
// };
