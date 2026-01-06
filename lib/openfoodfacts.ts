export async function getIngredientsFromOFF() {
  const res = await fetch(
    "https://world.openfoodfacts.org/api/v0/product/3017620422003.json"
  );
  const data = await res.json();

  return {
    ingredientsText: data.product?.ingredients_text || "",
    productName: data.product?.product_name || "Unknown product",
  };
}