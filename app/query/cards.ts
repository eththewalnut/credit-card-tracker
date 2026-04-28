type Cards = {
  id: string;
  bankNameWithIdentifier: string;
};

export async function getCards() {
  const response = await fetch("/api/cards");
  const cardResponse = await response.json();
  const cards: Cards[] = cardResponse.data;
  return cards;
}
