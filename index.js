require("dotenv").config();
const { Bot, Keyboard } = require("grammy");
const responses = require("./responses");
const {
  cookingFacts,
  cookingTips,
  firstRecipe,
  secondRecipe,
  thirdRecipe,
} = require("./responses");
const { getRandomItem } = require("./utils");
const { firstIngredients } = require("./responses");
const { secondIngredients } = require("./responses");
const { thirdIngredients } = require("./responses");

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const startKeyboard = new Keyboard()
    .text("🔍Узнать о пользе яиц «ОМЕГА-6»")
    .text("🍳Посмотреть рецепты омлета")
    .row()
    .text("💡Получить советы по приготовлению")
    .text("📚Узнать интересные факты об омлетах")
    .resized();

  await ctx.reply(
    `   
    ${"\u00A0\u00A0\u00A0\u00A0"}Привет! 😄 Я твой виртуальный шеф-повар Омлетик, и сегодня мы с тобой будем готовить не просто омлет, а настоящий кулинарный шедевр! 🥚✨ 
    ${"\u00A0\u00A0\u00A0\u00A0"}Ты готов? Давай вместе научимся готовить вкусный омлет! 🚀🌟

    🆕 Нажми на кнопку, чтобы узнать больше:

    🔍 Узнать о пользе яиц «ОМЕГА-6»
    🍳 Посмотреть рецепты омлета

    🌟 Советы и факты:

    💡 Получить советы по приготовлению
    📚 Узнать интересные факты об омлетах

    ✨ Каждая кнопка — это шаг к кулинарному мастерству! Поехали! 🎉👩‍🍳
    `,
    {
      reply_markup: startKeyboard,
    }
  );
});

bot.hears(
  [
    "🔍Узнать о пользе яиц «ОМЕГА-6»",
    "🍳Посмотреть рецепты омлета",
    "🍳Перейти к рецепту",
    "💡Получить советы по приготовлению",
    "📚Узнать интересные факты об омлетах",
  ],
  async (ctx) => {
    const topic = ctx.message.text;

    if (topic === "🔍Узнать о пользе яиц «ОМЕГА-6»") {
      await ctx.reply(responses.eggBenefitsText, {
        reply_markup: new Keyboard()
          .text("🍳Перейти к рецепту")
          .text("Назад 🔙")
          .resized(),
      });
    } else if (
      topic === "🍳Посмотреть рецепты омлета" ||
      topic === "🍳Перейти к рецепту"
    ) {
      await ctx.reply(responses.recipesText, {
        reply_markup: new Keyboard()
          .text("Омлет с помидорами и сыром 🍳🍅🧀")
          .text("Омлет с грибами и шпинатом 🍳🍄🌿")
          .row()
          .text("Яйца-бенедикт 🍳🥑🍞")
          .text("Назад 🔙")
          .resized(),
      });
    } else if (topic === "💡Получить советы по приготовлению") {
      const randomTip = getRandomItem(cookingTips);
      await ctx.reply(randomTip, {
        reply_markup: new Keyboard()
          .text("Еще совет 💡")
          .text("Назад 🔙")
          .resized(),
      });
    } else if (topic === "📚Узнать интересные факты об омлетах") {
      const randomTip = getRandomItem(cookingFacts);
      await ctx.reply(randomTip, {
        reply_markup: new Keyboard()
          .text("Узнать еще 📖")
          .text("Назад 🔙")
          .resized(),
      });
    }
  }
);

async function showMainMenu(ctx) {
  const startKeyboard = new Keyboard()
    .text("🔍Узнать о пользе яиц «ОМЕГА-6»")
    .text("🍳Посмотреть рецепты омлета")
    .row()
    .text("💡Получить советы по приготовлению")
    .text("📚Узнать интересные факты об омлетах")
    .resized();

  await ctx.reply("Выберите, что вы хотите сделать:", {
    reply_markup: startKeyboard,
  });
}

bot.hears("Назад 🔙", async (ctx) => {
  await showMainMenu(ctx);
});

bot.hears("Завершить 🎉", async (ctx) => {
  await showMainMenu(ctx);
});

bot.hears("Еще совет 💡", async (ctx) => {
  const randomTip = getRandomItem(cookingTips);
  await ctx.reply(randomTip, {
    reply_markup: new Keyboard()
      .text("Еще совет 💡")
      .text("Назад 🔙")
      .resized(),
  });
});

bot.hears("Узнать еще 📖", async (ctx) => {
  const randomTip = getRandomItem(cookingFacts);
  await ctx.reply(randomTip, {
    reply_markup: new Keyboard()
      .text("Узнать еще 📖")
      .text("Назад 🔙")
      .resized(),
  });
});

function continueRecipe(recipe) {
  bot.hears("Продолжить готовку👩‍🍳✨", async (ctx) => {
    const userId = ctx.from.id;

    if (userStates[userId]) {
      userStates[userId].step = 0;

      await ctx.reply(
        userStates[userId].currentRecipe[userStates[userId].step],
        {
          reply_markup: new Keyboard()
            .text("Готово ✅")
            .text("Назад 🔙")
            .resized(),
        }
      );
    }
  });
}

continueRecipe(firstRecipe);
continueRecipe(secondRecipe);
continueRecipe(thirdRecipe);

function setupIngredients() {
  bot.hears("Ингредиенты🍽️✨", async (ctx) => {
    const userId = ctx.from.id;

    if (userStates[userId]) {
      const currentRecipeName = userStates[userId].currentRecipe;

      let ingredientsList;

      if (currentRecipeName === firstRecipe) {
        ingredientsList = firstIngredients;
      } else if (currentRecipeName === secondRecipe) {
        ingredientsList = secondIngredients;
      } else if (currentRecipeName === thirdRecipe) {
        ingredientsList = thirdIngredients;
      } else {
        ingredientsList = []; 
      }

      if (Array.isArray(ingredientsList)) {
        await ctx.reply(ingredientsList.join("\n"), {
          reply_markup: new Keyboard()
            .text("Продолжить готовку👩‍🍳✨")
            .text("Назад 🔙")
            .resized(),
        });
      } else {
        await ctx.reply("Ошибка: ингредиенты не найдены.");
      }
    }
  });
}

setupIngredients(firstIngredients);
setupIngredients(secondIngredients);
setupIngredients(thirdIngredients);

const userStates = {};

function setupRecipeHandler(recipeArray, recipeName) {
  bot.hears(recipeName, async (ctx) => {
    const userId = ctx.from.id;
    userStates[userId] = {
      step: 0,
      currentRecipe: recipeArray, 
      currentRecipeName: recipeName, 
    };

    await ctx.reply(recipeArray[userStates[userId].step], {
      reply_markup: new Keyboard()
        .text("Ингредиенты🍽️✨")
        .row()
        .text("Готово ✅")
        .text("Назад 🔙")
        .resized(),
    });
  });
}

setupRecipeHandler(firstRecipe, "Омлет с помидорами и сыром 🍳🍅🧀");
setupRecipeHandler(secondRecipe, "Омлет с грибами и шпинатом 🍳🍄🌿");
setupRecipeHandler(thirdRecipe, "Яйца-бенедикт 🍳🥑🍞");

bot.hears("Готово ✅", async (ctx) => {
  const userId = ctx.from.id;

  if (userStates[userId]) {
    userStates[userId].step++;

    if (userStates[userId].step < userStates[userId].currentRecipe.length) {
      await ctx.reply(
        userStates[userId].currentRecipe[userStates[userId].step],
        {
          reply_markup: new Keyboard()
            .text("Готово ✅")
            .text("Назад 🔙")
            .resized(),
        }
      );
    } else {
      await ctx.reply(responses.finalText, {
        reply_markup: new Keyboard()
          .text("Завершить 🎉")
          .text("Назад 🔙")
          .resized(),
      });

      delete userStates[userId];
    }
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  console.error("Error:", e);
});

bot.start();
