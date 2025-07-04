# **Bite2Byte: AI-Powered Nutrient Tracker**

Bite2Byte is a web application designed to help users track their daily caloric and macronutrient intake. It features an AI-powered assistant that can estimate nutritional information from natural language and help users set personalized health goals.

## **Features**

* **AI-Powered Food Logging**: Describe your meal in plain text (e.g., "I had a chicken salad for lunch"), and the AI assistant will estimate and log the nutritional values for you.  
* **Manual Data Entry**: Manually log your food intake with a simple form.  
* **Personalized Goal Setting**: Set your own daily nutritional goals or let the AI calculate them for you based on your age, weight, height, activity level, and fitness objectives.  
* **Interactive Dashboard**: Visualize your daily progress with dynamic charts for calories and macronutrients (proteins, fats, carbohydrates).  
* **Historical Data**: Navigate through previous days to review your nutritional history.


## **Getting Started**

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites**

You need to have [Node.js](https://nodejs.org/) (version 18.18.0 or later) and a package manager like npm or yarn installed on your system.

### **Installation**

1. **Clone the repository:**  
   ```Bash  
   git clone https://github.com/loefflerjakob/bite2byte.git
   ```

    ```Bash
   cd bite2byte
   ```

2. Install dependencies:  
   Using npm:
   ```Bash  
   npm install
   ```

   Or using yarn:  
   ```Bash
   yarn install
   ```

3. Set up the environment variables:  
   This project uses AI models from different providers. You will need to provide your own API keys to use them.  
   Create a file named .env in the root of your project and add the following keys, depending on which model you want to use:  
   ```Bash  
   # For OpenAI models  
   OPENAI_API_KEY="your-openai-api-key"

   # For Google Gemini models  
   GOOGLE_API_KEY="your-google-api-key"

   # For Groq models  
   GROQ_API_KEY="your-groq-api-key"
   ```

   You can select which model to use by changing the runtimeUrl prop in the CopilotKit component in app/layout.tsx.  
4. Set up the database:  
   This project uses Prisma with a SQLite database. To create the database and apply the necessary table structures, run the following command: 

   ```Bash  
   npx prisma db push
   ```

   This will create a dev.db file in the prisma/ directory, which will store all your application data.  
5. **Run the development server:**  
   ```Bash  
   npm run dev
   ```

   Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

You can now start using the application. The page will auto-update as you edit the code.

## **Available Scripts**

In the project directory, you can run:

* npm run dev: Runs the app in development mode.  
* npm run build: Builds the app for production.  
* npm run start: Starts a production server.  
* npm run lint: Runs the linter to check for code quality issues.