const url = 'https://reqres.in/api/users'; // Substitua com a URL correta

async function getUsers() {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1'
      }
    });

    const data = await response.json();
    console.log('Usuários:', data);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
}

getUsers();
