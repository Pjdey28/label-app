export function websetsConceptualize(ingredients: string[]) {
  return ingredients.map(i => {
    if (i.startsWith("E")) {
      return { ingredient: i, concept: "industrial additive" };
    }
    if (i.toLowerCase().includes("oil")) {
      return { ingredient: i, concept: "processed fat" };
    }
    return { ingredient: i, concept: "common food component" };
  });
}
