const { Translate } = require("@google-cloud/translate").v2;
// const translate = new Translate();

// export async function translateText(text: string, targets: string[]) {
//   console.log("_______________________");
//   console.log("Translating:\n", text, "\nTo: ", targets);

//   targets.forEach(async (target) => {
//     let [translations] = await translate.translate(text, target);
//     translations = Array.isArray(translations) ? translations : [translations];
//     console.log("Translations:");
//     translations.forEach((translation: any, i: number) => {
//       console.log(`${text[i]} => (${target}) ${translation}`);
//     });
//   });
// }
