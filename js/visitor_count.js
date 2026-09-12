async function get_visitors() {
  const visitorElement = document.getElementById('visitors');
  if (!visitorElement) return;

  try {
    const response = await fetch('https://4ix1ubxo38.execute-api.us-east-1.amazonaws.com/prod/countVisitor', {
      method: 'GET'
    });

    if (!response.ok) throw new Error('Visitor counter request failed');

    const data = await response.json();
    const visitorCount = data && data.visitor_count;
    if (visitorCount === undefined || visitorCount === null || visitorCount === '') {
      throw new Error('Visitor counter response was invalid');
    }

    visitorElement.textContent = visitorCount;
    return data;
  } catch (err) {
    visitorElement.textContent = 'Unavailable';
  }
}
get_visitors();
